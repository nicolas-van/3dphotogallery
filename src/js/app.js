
(function() {
"use strict";


    window.PhotoGallery = function PhotoGallery(element) {
        this.element = element;
        this._photos = [];
        this._planes = [];
        this._columns = 3;
        this._tileSize = 5;
        this._tileSpace = [1, 1];
        this.start();
    };
    _.extend(PhotoGallery.prototype, {
        start: function() {
            this._scene = new THREE.Scene();
            this._camera = new THREE.PerspectiveCamera( 90, 1, 0.1, 1000 );
            if (window.WebGLRenderingContext)
                this._renderer = new THREE.WebGLRenderer({ alpha: true });
            else
                this._renderer = new THREE.CanvasRenderer({ alpha: true });
            this.element.append(this._renderer.domElement);

            $(window).resize(this.updateSize.bind(this));
            this.updateSize();

            var width = ((this._tileSize * this._columns) + (this._tileSpace[0] * (this._columns + 1)));
            this._camera.position.x = width / 2;
            this._camera.position.y = - (width / 2);
            this._camera.position.z = width * 0.275;

            this._updatePhotos();

            this._last = new Date().getTime() / 1000;
            requestAnimationFrame(this._render.bind(this));
        },
        setPhotos: function(photos) {
            this._photos = _.clone(photos);
            this._updatePhotos();
        },
        updateSize: function() {
            this._renderer.setSize(this.element.width(), this.element.height());
            this._camera.aspect = this.element.width() / this.element.height();
            this._camera.updateProjectionMatrix();
        },
        _updatePhotos: function() {
            this._planes.forEach(function(el) {
                this._scene.remove(el);
            }.bind(this));
            this._planes = [];
            this._photos.forEach(function(el, i) {
                var texture = THREE.ImageUtils.loadTexture(el, undefined, function() {
                    var w = texture.image.width;
                    var h = texture.image.height;
                    if (w > h) {
                        h = this._tileSize / (w / h);
                        w = this._tileSize;
                    } else {
                        w = this._tileSize * (w / h);
                        h = this._tileSize;
                    }
                    var material = new THREE.MeshBasicMaterial({map: texture});
                    var geometry = new THREE.PlaneGeometry(w, h);
                    var plane = new THREE.Mesh(geometry, material);

                    var col = i % this._columns;
                    var row = Math.floor(i / this._columns);
                    plane.position.z = 0;
                    plane.position.x = (col * this._tileSize) + (this._tileSize / 2) + (this._tileSpace[0] * (col + 1));
                    plane.position.y = - ((row * this._tileSize) + (this._tileSize / 2) + (this._tileSpace[1] * (row + 1)));

                    this._scene.add(plane);
                    this._planes.push(plane);
                }.bind(this));
            }.bind(this));
        },
        _render: function() {
            var current = new Date().getTime() / 1000;
            var deltat = current - this._last;

            this._renderer.render(this._scene, this._camera);

            this._last = current;
            requestAnimationFrame(this._render.bind(this));
        },
    });

})();
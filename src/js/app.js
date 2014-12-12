
(function() {
"use strict";

    window.PhotoGallery = function PhotoGallery(element) {
        this.element = element;
        this._photos = [];
        this._planes = [];
        this.start();
    };
    _.extend(PhotoGallery.prototype, {
        start: function() {
            this._scene = new THREE.Scene();
            this._camera = new THREE.PerspectiveCamera( 75, 1, 0.1, 1000 );
            if (window.WebGLRenderingContext)
                this._renderer = new THREE.WebGLRenderer({ alpha: true });
            else
                this._renderer = new THREE.CanvasRenderer({ alpha: true });
            this.element.append(this._renderer.domElement);

            $(window).resize(this.updateSize.bind(this));
            this.updateSize();

            this._camera.position.z = 5;
            this._camera.lookAt(new THREE.Vector3(0, 0, 0));

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
            this._photos.forEach(function(el) {
                var texture = THREE.ImageUtils.loadTexture(el);
                var material = new THREE.MeshBasicMaterial({map: texture});
                var geometry = new THREE.PlaneGeometry(5, 5);
                var plane = new THREE.Mesh(geometry, material);
                this._scene.add(plane);
                this._planes.push(plane);
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
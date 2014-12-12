
(function() {
"use strict";

    window.PhotoGallery = function PhotoGallery(element) {
        this.element = element;
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

            var geometry = new THREE.BoxGeometry( 1, 1, 1 );
            var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
            this._cube = new THREE.Mesh( geometry, material );
            this._scene.add(this._cube);

            this._camera.position.z = 5;


            this._last = new Date().getTime() / 1000;
            requestAnimationFrame(this._render.bind(this));
        },
        updateSize: function() {
            this._renderer.setSize(this.element.width(), this.element.height());
            this._camera.aspect = this.element.width() / this.element.height();
            this._camera.updateProjectionMatrix();
        },
        _render: function() {
            var current = new Date().getTime() / 1000;
            var deltat = current - this._last;
            this._cube.rotation.x += deltat * 1;
            this._cube.rotation.y += deltat * 1;
            this._renderer.render(this._scene, this._camera);
            this._last = current;
            requestAnimationFrame(this._render.bind(this));
        },
    });

})();
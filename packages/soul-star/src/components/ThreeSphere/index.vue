<template>
    <div ref="container" class="sphere-container"></div>
</template>

<script>
import * as THREE from 'three';
import { markRaw } from 'vue';

export default {
    name: 'ThreeSphere',
    props: {
        autoRotationSpeed: {
            type: Number,
            default: 0.0005
        },
        sphereRadius: {
            type: Number,
            default: 4.85
        },
        ballRadius: {
            type: Number,
            default: 0.15
        },
        numPoints: {
            type: Number,
            default: 88
        },
        labelMaxWidth: {
            type: Number,
            default: 160
        },
        labelTextSpeed: {
            type: Number,
            default: 0.002
        }
    },
    data() {
        return {
            scene: null,
            camera: null,
            renderer: null,
            sphere: null,
            smallBalls: [],
            labelSprites: [],
            raycaster: null,
            mouse: null,
            isDragging: false,
            previousMousePosition: { x: 0, y: 0 },
            lastDragDelta: { x: 0, y: 0 },
            autoRotationAxis: null,
            currentAngularVelocity: null,
            decayRate: 0.92,
            increaseRate: 1.02
        };
    },
    mounted() {
        this.initThree();
        this.animate();
        this.addEventListeners();
    },
    beforeUnmount() {
        this.removeEventListeners();
    },
    methods: {
        initThree() {
            // Create scene (markRaw 避免被 Vue 代理)
            this.scene = markRaw(new THREE.Scene());

            // Create camera
            this.camera = markRaw(new THREE.PerspectiveCamera(
                75,
                this.$refs.container.clientWidth / this.$refs.container.clientHeight,
                0.1,
                1000
            ));
            this.camera.position.set(0, 0, 14);
            this.camera.lookAt(0, 0, 0);

            // Create renderer
            this.renderer = markRaw(new THREE.WebGLRenderer({ antialias: true, alpha: true }));
            this.renderer.setSize(
                this.$refs.container.clientWidth,
                this.$refs.container.clientHeight
            );
            this.renderer.setPixelRatio(window.devicePixelRatio);
            this.renderer.setClearColor(0x000000, 0);
            this.$refs.container.appendChild(this.renderer.domElement);

            // Create sphere
            this.createSphere();

            // Create small balls and labels
            this.createSmallBallsAndLabels();

            // Add lights
            this.addLights();

            // Initialize interaction variables
            this.raycaster = markRaw(new THREE.Raycaster());
            this.mouse = markRaw(new THREE.Vector2());
            this.autoRotationAxis = new THREE.Vector3(0, 1, 0).normalize();
            this.currentAngularVelocity = this.autoRotationAxis
                .clone()
                .multiplyScalar(this.autoRotationSpeed);
        },

        createSphere() {
            const sphereGeometry = new THREE.SphereGeometry(this.sphereRadius, 16, 16);
            const sphereMaterial = new THREE.ShaderMaterial({
                uniforms: {
                    color: { value: new THREE.Color(0x000000) },
                    opacity: { value: 0.8 }
                },
                vertexShader: `
            varying vec3 vNormal;
            void main() {
                vNormal = normalize(normalMatrix * normal);
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
            }
          `,
                fragmentShader: `
            uniform vec3 color;
            uniform float opacity;
            varying vec3 vNormal;
            void main() {
                float alpha = opacity * smoothstep(0.5, 1.0, vNormal.z);
                gl_FragColor = vec4(color, alpha);
            }
          `,
                transparent: true,
                side: THREE.FrontSide,
                depthWrite: false
            });

            this.sphere = markRaw(new THREE.Mesh(sphereGeometry, sphereMaterial));
            this.scene.add(this.sphere);
        },

        createSmallBallsAndLabels() {
            const smallBallGeometry = new THREE.SphereGeometry(this.ballRadius, 16, 16);
            const goldenRatio = (1 + Math.sqrt(5)) / 2;

            for (let i = 0; i < this.numPoints; i++) {
                const y = 1 - (i / (this.numPoints - 1)) * 2;
                const radiusAtY = Math.sqrt(1 - y * y);

                const theta = (2 * Math.PI * i) / goldenRatio;

                const x = Math.cos(theta) * radiusAtY;
                const z = Math.sin(theta) * radiusAtY;
                const smallBallMaterial = new THREE.MeshBasicMaterial({
                    color: this.getRandomBrightColor(),
                    depthWrite: true,
                    depthTest: true,
                    side: THREE.FrontSide
                });
                const smallBall = markRaw(new THREE.Mesh(smallBallGeometry, smallBallMaterial));
                smallBall.position.set(x * this.sphereRadius, y * this.sphereRadius, z * this.sphereRadius);
                this.sphere.add(smallBall);
                this.smallBalls.push(smallBall);

                const labelText = this.getRandomNickname();
                const { texture, needMarquee, HWRate } = this.createTextTexture(labelText, {
                    fontSize: 28,
                    fontFace: 'PingFang SC, Microsoft YaHei, Noto Sans, Arial, sans-serif',
                    textColor: '#bbbbbb',
                    maxWidth: this.labelMaxWidth
                });

                const spriteMaterial = new THREE.SpriteMaterial({
                    map: texture,
                    transparent: true,
                    depthWrite: true,
                    depthTest: true,
                    blending: THREE.NormalBlending
                });

                const sprite = markRaw(new THREE.Sprite(spriteMaterial));
                sprite.scale.set(1, HWRate, 1);
                this.labelSprites.push({ sprite, smallBall, texture, needMarquee, labelText });
                this.scene.add(sprite);
            }
        },

        addLights() {
            const light = new THREE.AmbientLight(0xffffff, 0.5);
            this.scene.add(light);
            const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
            directionalLight.position.set(5, 5, 5);
            this.scene.add(directionalLight);
        },

        createTextTexture(text, parameters = {}) {
            const {
                fontSize = 24,
                fontFace = 'PingFang SC, Microsoft YaHei, Noto Sans, Arial, sans-serif',
                textColor = 'white',
                backgroundColor = 'rgba(0,0,0,0)',
                maxWidth = this.labelMaxWidth
            } = parameters;

            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            context.font = `${fontSize}px ${fontFace}`;

            const textMetrics = context.measureText(text);
            const textWidth = Math.ceil(textMetrics.width);
            const textHeight = fontSize * 1.2;

            const needMarquee = textWidth > maxWidth;

            let canvasWidth = maxWidth;
            if (needMarquee) {
                canvasWidth = textWidth + 60;
            }

            canvas.width = canvasWidth;
            canvas.height = textHeight;
            context.font = `${fontSize}px ${fontFace}`;
            context.clearRect(0, 0, canvas.width, canvas.height);

            context.fillStyle = backgroundColor;
            context.fillRect(0, 0, canvas.width, canvas.height);

            context.fillStyle = textColor;
            context.textAlign = needMarquee ? 'left' : 'center';
            context.textBaseline = 'middle';

            if (needMarquee) {
                context.fillText(text, 0, canvas.height / 2);
            } else {
                context.fillText(text, maxWidth / 2, canvas.height / 2);
            }

            const texture = new THREE.CanvasTexture(canvas);
            texture.needsUpdate = true;

            if (needMarquee) {
                texture.wrapS = THREE.RepeatWrapping;
                texture.wrapT = THREE.ClampToEdgeWrapping;
                texture.repeat.x = maxWidth / canvas.width;
            } else {
                texture.wrapS = THREE.ClampToEdgeWrapping;
                texture.wrapT = THREE.ClampToEdgeWrapping;
            }

            texture.minFilter = THREE.LinearFilter;
            texture.magFilter = THREE.LinearFilter;
            texture.generateMipmaps = false;
            return { texture, needMarquee, HWRate: textHeight / maxWidth };
        },

        addEventListeners() {
            window.addEventListener('mousedown', this.onMouseDown);
            window.addEventListener('mousemove', this.onMouseMove);
            window.addEventListener('mouseup', this.onMouseUp);
            window.addEventListener('touchstart', this.onTouchStart);
            window.addEventListener('touchmove', this.onTouchMove);
            window.addEventListener('touchend', this.onTouchEnd);
            window.addEventListener('click', this.onMouseClick);
            window.addEventListener('resize', this.onWindowResize);
            document.addEventListener('gesturestart', this.onGestureStart);
        },

        removeEventListeners() {
            window.removeEventListener('mousedown', this.onMouseDown);
            window.removeEventListener('mousemove', this.onMouseMove);
            window.removeEventListener('mouseup', this.onMouseUp);
            window.removeEventListener('touchstart', this.onTouchStart);
            window.removeEventListener('touchmove', this.onTouchMove);
            window.removeEventListener('touchend', this.onTouchEnd);
            window.removeEventListener('click', this.onMouseClick);
            window.removeEventListener('resize', this.onWindowResize);
            document.removeEventListener('gesturestart', this.onGestureStart);
        },

        onMouseDown(event) {
            this.isDragging = true;
            this.previousMousePosition = {
                x: event.clientX,
                y: event.clientY
            };
        },

        onMouseMove(event) {
            if (this.isDragging) {
                const deltaX = event.clientX - this.previousMousePosition.x;
                const deltaY = event.clientY - this.previousMousePosition.y;

                this.lastDragDelta = { x: deltaX, y: deltaY };

                const rotationFactor = 0.005;

                const angleY = deltaX * rotationFactor;
                const angleX = deltaY * rotationFactor;

                const quaternionY = new THREE.Quaternion().setFromAxisAngle(
                    new THREE.Vector3(0, 1, 0),
                    angleY
                );
                const quaternionX = new THREE.Quaternion().setFromAxisAngle(
                    new THREE.Vector3(1, 0, 0),
                    angleX
                );

                const deltaQuat = new THREE.Quaternion().multiplyQuaternions(quaternionY, quaternionX);

                this.sphere.quaternion.multiplyQuaternions(deltaQuat, this.sphere.quaternion);

                const dragRotationAxis = new THREE.Vector3(deltaY, deltaX, 0).normalize();
                const dragRotationSpeed = Math.sqrt(deltaX * deltaX + deltaY * deltaY) * rotationFactor;

                if (dragRotationAxis.length() > 0) {
                    this.currentAngularVelocity.copy(dragRotationAxis).multiplyScalar(dragRotationSpeed);
                }

                this.previousMousePosition = {
                    x: event.clientX,
                    y: event.clientY
                };
            }
        },

        onMouseUp() {
            if (this.isDragging) {
                this.isDragging = false;

                const deltaX = this.lastDragDelta.x;
                const deltaY = this.lastDragDelta.y;

                if (deltaX !== 0 || deltaY !== 0) {
                    const newAxis = new THREE.Vector3(deltaY, deltaX, 0).normalize();
                    if (newAxis.length() > 0) {
                        this.autoRotationAxis.copy(newAxis);
                    }

                    const dragSpeed = this.currentAngularVelocity.length();
                    if (dragSpeed > this.autoRotationSpeed) {
                        // Maintain current rotation speed
                    } else {
                        this.currentAngularVelocity.copy(this.autoRotationAxis).multiplyScalar(this.autoRotationSpeed);
                    }
                }
            }
        },

        onTouchStart(event) {
            this.isDragging = true;
            const touch = event.touches[0];
            this.previousMousePosition = {
                x: touch.clientX,
                y: touch.clientY
            };
        },

        onTouchMove(event) {
            event.preventDefault();
            if (this.isDragging) {
                const touch = event.touches[0];
                const deltaX = touch.clientX - this.previousMousePosition.x;
                const deltaY = touch.clientY - this.previousMousePosition.y;

                this.lastDragDelta = { x: deltaX, y: deltaY };

                const rotationFactor = 0.002;

                const angleY = deltaX * rotationFactor;
                const angleX = deltaY * rotationFactor;

                const quaternionY = new THREE.Quaternion().setFromAxisAngle(
                    new THREE.Vector3(0, 1, 0),
                    angleY
                );
                const quaternionX = new THREE.Quaternion().setFromAxisAngle(
                    new THREE.Vector3(1, 0, 0),
                    angleX
                );

                const deltaQuat = new THREE.Quaternion().multiplyQuaternions(quaternionY, quaternionX);

                this.sphere.quaternion.multiplyQuaternions(deltaQuat, this.sphere.quaternion);

                const dragRotationAxis = new THREE.Vector3(deltaY, deltaX, 0).normalize();
                const dragRotationSpeed = Math.sqrt(deltaX * deltaX + deltaY * deltaY) * rotationFactor;

                if (dragRotationAxis.length() > 0) {
                    this.currentAngularVelocity.copy(dragRotationAxis).multiplyScalar(dragRotationSpeed);
                }

                this.previousMousePosition = {
                    x: touch.clientX,
                    y: touch.clientY
                };
            }
        },

        onTouchEnd(event) {
            if (this.isDragging) {
                this.isDragging = false;

                const deltaX = this.lastDragDelta.x;
                const deltaY = this.lastDragDelta.y;

                if (deltaX !== 0 || deltaY !== 0) {
                    const newAxis = new THREE.Vector3(deltaY, deltaX, 0).normalize();
                    if (newAxis.length() > 0) {
                        this.autoRotationAxis.copy(newAxis);
                    }

                    const dragSpeed = this.currentAngularVelocity.length();
                    if (dragSpeed > this.autoRotationSpeed) {
                        // Maintain current rotation speed
                    } else {
                        this.currentAngularVelocity.copy(this.autoRotationAxis).multiplyScalar(this.autoRotationSpeed);
                    }
                }
            }

            // Check for click event
            if (event.changedTouches.length > 0) {
                const touch = event.changedTouches[0];
                this.mouse.x = (touch.clientX / window.innerWidth) * 2 - 1;
                this.mouse.y = -(touch.clientY / window.innerHeight) * 2 + 1;
                this.checkIntersection();
            }
        },

        onMouseClick(event) {
            event.preventDefault();
            this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
            this.checkIntersection();
        },

        onWindowResize() {
            this.camera.aspect = this.$refs.container.clientWidth / this.$refs.container.clientHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(
                this.$refs.container.clientWidth,
                this.$refs.container.clientHeight
            );
        },

        onGestureStart(e) {
            e.preventDefault();
        },

        checkIntersection() {
            this.raycaster.setFromCamera(this.mouse, this.camera);
            const intersects = this.raycaster.intersectObjects(this.smallBalls);

            if (intersects.length > 0) {
                const intersectedBall = intersects[0].object;
                const index = this.smallBalls.indexOf(intersectedBall);
                if (index !== -1) {
                    const labelInfo = this.labelSprites[index];
                    this.showLabelInfo(labelInfo);
                }
            }
        },

        showLabelInfo(labelInfo) {
            this.$emit('ball-clicked', labelInfo.labelText);
        },

        animate() {
            requestAnimationFrame(this.animate);

            if (!this.isDragging) {
                const deltaQuat = new THREE.Quaternion().setFromEuler(
                    new THREE.Euler(
                        this.currentAngularVelocity.x,
                        this.currentAngularVelocity.y,
                        this.currentAngularVelocity.z,
                        'XYZ'
                    )
                );
                this.sphere.quaternion.multiplyQuaternions(deltaQuat, this.sphere.quaternion);

                const currentSpeed = this.currentAngularVelocity.length();

                if (currentSpeed > this.autoRotationSpeed) {
                    this.currentAngularVelocity.multiplyScalar(this.decayRate);

                    if (this.currentAngularVelocity.length() < this.autoRotationSpeed) {
                        this.currentAngularVelocity.copy(this.autoRotationAxis).multiplyScalar(this.autoRotationSpeed);
                    }
                } else if (currentSpeed < this.autoRotationSpeed) {
                    this.currentAngularVelocity.multiplyScalar(this.increaseRate);

                    if (this.currentAngularVelocity.length() > this.autoRotationSpeed) {
                        this.currentAngularVelocity.copy(this.autoRotationAxis).multiplyScalar(this.autoRotationSpeed);
                    }
                } else {
                    this.currentAngularVelocity.copy(this.autoRotationAxis).multiplyScalar(this.autoRotationSpeed);
                }
            }

            // Update label positions and marquee effects
            this.labelSprites.forEach(({ sprite, smallBall, texture, needMarquee }) => {
                smallBall.updateMatrixWorld();
                const smallBallWorldPos = new THREE.Vector3();
                smallBall.getWorldPosition(smallBallWorldPos);

                const upOffset = new THREE.Vector3(0, 0.3, 0);

                sprite.position.copy(smallBallWorldPos).add(upOffset);

                if (needMarquee) {
                    texture.offset.x += this.labelTextSpeed;

                    if (texture.offset.x > 1) {
                        texture.offset.x = 0;
                    }
                }
            });

            this.renderer.render(this.scene, this.camera);
        },

        getRandomBrightColor() {
            const hue = Math.floor(Math.random() * 360);
            const saturation = Math.floor(Math.random() * 40 + 10);
            const lightness = Math.floor(Math.random() * 40 + 40);

            const rgb = this.hslToRgb(hue, saturation, lightness);

            return (rgb.r << 16) | (rgb.g << 8) | rgb.b;
        },

        hslToRgb(h, s, l) {
            s /= 100;
            l /= 100;

            const c = (1 - Math.abs(2 * l - 1)) * s;
            const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
            const m = l - c / 2;

            let r, g, b;
            if (h >= 0 && h < 60) {
                r = c;
                g = x;
                b = 0;
            } else if (h >= 60 && h < 120) {
                r = x;
                g = c;
                b = 0;
            } else if (h >= 120 && h < 180) {
                r = 0;
                g = c;
                b = x;
            } else if (h >= 180 && h < 240) {
                r = 0;
                g = x;
                b = c;
            } else if (h >= 240 && h < 300) {
                r = x;
                g = 0;
                b = c;
            } else {
                r = c;
                g = 0;
                b = x;
            }

            return {
                r: Math.round((r + m) * 255),
                g: Math.round((g + m) * 255),
                b: Math.round((b + m) * 255)
            };
        },

        getRandomNickname() {
            const adjectives = [
                'Cool',
                'Crazy',
                'Mysterious',
                'Happy',
                'Silly',
                'Brave',
                'Smart',
                'Swift',
                'Fierce',
                'Gentle'
            ];
            const nouns = [
                'Tiger',
                'Lion',
                'Dragon',
                'Wizard',
                'Ninja',
                'Pirate',
                'Hero',
                'Ghost',
                'Phantom',
                'Knight'
            ];

            const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
            const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];

            const nickname = `${randomAdjective} ${randomNoun}`;

            if (nickname.length < 2) {
                return this.getRandomNickname();
            } else if (nickname.length > 22) {
                return nickname.slice(0, 22);
            }

            return nickname;
        }
    }
};
</script>

<style scoped>
.sphere-container {
    width: 100%;
    height: 100%;
    margin: 0;
    touch-action: none;
}
</style>
<template>
    <div ref="container" class="sphere-container"></div>
</template>

<script setup lang="ts">
import * as THREE from 'three';
import { ref, reactive, onMounted, onBeforeUnmount, markRaw } from 'vue';

// 定义组件属性
const props = withDefaults(defineProps<{
    autoRotationSpeed?: number;
    sphereRadius?: number;
    ballRadius?: number;
    numPoints?: number;
    labelMaxWidth?: number;
    labelTextSpeed?: number;
}>(), {
    autoRotationSpeed: 0.0005,
    sphereRadius: 4.85,
    ballRadius: 0.15,
    numPoints: 88,
    labelMaxWidth: 160,
    labelTextSpeed: 0.002
});

// 定义事件
const emit = defineEmits<{
    'ball-clicked': [label: string];
}>();

// DOM 引用
const container = ref<HTMLDivElement | null>(null);

// 响应式状态
const state = reactive({
    scene: null as THREE.Scene | null,
    camera: null as THREE.PerspectiveCamera | null,
    renderer: null as THREE.WebGLRenderer | null,
    sphere: null as THREE.Mesh | null,
    smallBalls: [] as THREE.Mesh[],
    labelSprites: [] as {
        sprite: THREE.Sprite;
        smallBall: THREE.Mesh;
        texture: THREE.CanvasTexture;
        needMarquee: boolean;
        labelText: string;
    }[],
    raycaster: null as THREE.Raycaster | null,
    mouse: null as THREE.Vector2 | null,
    isDragging: false,
    previousMousePosition: { x: 0, y: 0 },
    lastDragDelta: { x: 0, y: 0 },
    autoRotationAxis: new THREE.Vector3(0, 1, 0).normalize(),
    currentAngularVelocity: null as THREE.Vector3 | null,
    decayRate: 0.92,
    increaseRate: 1.02
});

// 初始化 Three.js
function initThree() {
    if (!container.value) return;

    // 创建场景
    state.scene = markRaw(new THREE.Scene());

    // 创建相机
    state.camera = markRaw(new THREE.PerspectiveCamera(
        75,
        container.value.clientWidth / container.value.clientHeight,
        0.1,
        1000
    ));
    state.camera.position.set(0, 0, 14);
    state.camera.lookAt(0, 0, 0);

    // 创建渲染器
    state.renderer = markRaw(new THREE.WebGLRenderer({ antialias: true, alpha: true }));
    state.renderer.setSize(
        container.value.clientWidth,
        container.value.clientHeight
    );
    state.renderer.setPixelRatio(window.devicePixelRatio);
    state.renderer.setClearColor(0x000000, 0);
    container.value.appendChild(state.renderer.domElement);

    // 创建球体
    createSphere();

    // 创建小球和标签
    createSmallBallsAndLabels();

    // 添加灯光
    addLights();

    // 初始化交互变量
    state.raycaster = markRaw(new THREE.Raycaster());
    state.mouse = markRaw(new THREE.Vector2());
    state.autoRotationAxis = markRaw(new THREE.Vector3(0, 1, 0).normalize());
    state.currentAngularVelocity = markRaw(state.autoRotationAxis
        .clone()
        .multiplyScalar(props.autoRotationSpeed));
}

// 创建球体
function createSphere() {
    if (!state.scene) return;

    const sphereGeometry = new THREE.SphereGeometry(props.sphereRadius, 16, 16);
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

    state.sphere = markRaw(new THREE.Mesh(sphereGeometry, sphereMaterial));
    state.scene.add(state.sphere);
}

// 创建小球和标签
function createSmallBallsAndLabels() {
    if (!state.sphere) return;

    const smallBallGeometry = new THREE.SphereGeometry(props.ballRadius, 16, 16);
    const goldenRatio = (1 + Math.sqrt(5)) / 2;

    for (let i = 0; i < props.numPoints; i++) {
        const y = 1 - (i / (props.numPoints - 1)) * 2;
        const radiusAtY = Math.sqrt(1 - y * y);

        const theta = (2 * Math.PI * i) / goldenRatio;

        const x = Math.cos(theta) * radiusAtY;
        const z = Math.sin(theta) * radiusAtY;
        const smallBallMaterial = new THREE.MeshBasicMaterial({
            color: getRandomBrightColor(),
            depthWrite: true,
            depthTest: true,
            side: THREE.FrontSide
        });
        const smallBall = markRaw(new THREE.Mesh(smallBallGeometry, smallBallMaterial));
        smallBall.position.set(x * props.sphereRadius, y * props.sphereRadius, z * props.sphereRadius);
        state.sphere.add(smallBall);
        state.smallBalls.push(smallBall);

        const labelText = getRandomNickname();
        const { texture, needMarquee, HWRate } = createTextTexture(labelText, {
            fontSize: 28,
            fontFace: 'PingFang SC, Microsoft YaHei, Noto Sans, Arial, sans-serif',
            textColor: '#bbbbbb',
            maxWidth: props.labelMaxWidth
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
        state.labelSprites.push({ sprite, smallBall, texture, needMarquee, labelText });
        if (state.scene) {
            state.scene.add(sprite);
        }
    }
}

// 添加灯光
function addLights() {
    if (!state.scene) return;

    const light = new THREE.AmbientLight(0xffffff, 0.5);
    state.scene.add(light);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    state.scene.add(directionalLight);
}

// 创建文本纹理
function createTextTexture(text: string, parameters: {
    fontSize?: number;
    fontFace?: string;
    textColor?: string;
    backgroundColor?: string;
    maxWidth?: number;
} = {}) {
    const {
        fontSize = 24,
        fontFace = 'PingFang SC, Microsoft YaHei, Noto Sans, Arial, sans-serif',
        textColor = 'white',
        backgroundColor = 'rgba(0,0,0,0)',
        maxWidth = props.labelMaxWidth
    } = parameters;

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) return { texture: new THREE.CanvasTexture(canvas), needMarquee: false, HWRate: 1 };

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
}

// 添加事件监听器
function addEventListeners() {
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('touchstart', onTouchStart);
    window.addEventListener('touchmove', onTouchMove);
    window.addEventListener('touchend', onTouchEnd);
    window.addEventListener('click', onMouseClick);
    window.addEventListener('resize', onWindowResize);
    document.addEventListener('gesturestart', onGestureStart);
}

// 移除事件监听器
function removeEventListeners() {
    window.removeEventListener('mousedown', onMouseDown);
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseup', onMouseUp);
    window.removeEventListener('touchstart', onTouchStart);
    window.removeEventListener('touchmove', onTouchMove);
    window.removeEventListener('touchend', onTouchEnd);
    window.removeEventListener('click', onMouseClick);
    window.removeEventListener('resize', onWindowResize);
    document.removeEventListener('gesturestart', onGestureStart);
}

// 鼠标按下事件
function onMouseDown(event: MouseEvent) {
    state.isDragging = true;
    state.previousMousePosition = {
        x: event.clientX,
        y: event.clientY
    };
}

// 鼠标移动事件
function onMouseMove(event: MouseEvent) {
    if (state.isDragging && state.sphere) {
        const deltaX = event.clientX - state.previousMousePosition.x;
        const deltaY = event.clientY - state.previousMousePosition.y;

        state.lastDragDelta = { x: deltaX, y: deltaY };

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

        state.sphere.quaternion.multiplyQuaternions(deltaQuat, state.sphere.quaternion);

        const dragRotationAxis = new THREE.Vector3(deltaY, deltaX, 0).normalize();
        const dragRotationSpeed = Math.sqrt(deltaX * deltaX + deltaY * deltaY) * rotationFactor;

        if (dragRotationAxis.length() > 0 && state.currentAngularVelocity) {
            state.currentAngularVelocity.copy(dragRotationAxis).multiplyScalar(dragRotationSpeed);
        }

        state.previousMousePosition = {
            x: event.clientX,
            y: event.clientY
        };
    }
}

// 鼠标松开事件
function onMouseUp() {
    if (state.isDragging) {
        state.isDragging = false;

        const deltaX = state.lastDragDelta.x;
        const deltaY = state.lastDragDelta.y;

        if ((deltaX !== 0 || deltaY !== 0) && state.currentAngularVelocity) {
            const newAxis = new THREE.Vector3(deltaY, deltaX, 0).normalize();
            if (newAxis.length() > 0) {
                state.autoRotationAxis.copy(newAxis);
            }

            const dragSpeed = state.currentAngularVelocity.length();
            if (dragSpeed <= props.autoRotationSpeed) {
                state.currentAngularVelocity.copy(state.autoRotationAxis).multiplyScalar(props.autoRotationSpeed);
            }
        }
    }
}

// 触摸开始事件
function onTouchStart(event: TouchEvent) {
    state.isDragging = true;
    const touch = event.touches[0];
    state.previousMousePosition = {
        x: touch.clientX,
        y: touch.clientY
    };
}

// 触摸移动事件
function onTouchMove(event: TouchEvent) {
    event.preventDefault();
    if (state.isDragging && state.sphere) {
        const touch = event.touches[0];
        const deltaX = touch.clientX - state.previousMousePosition.x;
        const deltaY = touch.clientY - state.previousMousePosition.y;

        state.lastDragDelta = { x: deltaX, y: deltaY };

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

        state.sphere.quaternion.multiplyQuaternions(deltaQuat, state.sphere.quaternion);

        const dragRotationAxis = new THREE.Vector3(deltaY, deltaX, 0).normalize();
        const dragRotationSpeed = Math.sqrt(deltaX * deltaX + deltaY * deltaY) * rotationFactor;

        if (dragRotationAxis.length() > 0 && state.currentAngularVelocity) {
            state.currentAngularVelocity.copy(dragRotationAxis).multiplyScalar(dragRotationSpeed);
        }

        state.previousMousePosition = {
            x: touch.clientX,
            y: touch.clientY
        };
    }
}

// 触摸结束事件
function onTouchEnd(event: TouchEvent) {
    if (state.isDragging) {
        state.isDragging = false;

        const deltaX = state.lastDragDelta.x;
        const deltaY = state.lastDragDelta.y;

        if ((deltaX !== 0 || deltaY !== 0) && state.currentAngularVelocity) {
            const newAxis = new THREE.Vector3(deltaY, deltaX, 0).normalize();
            if (newAxis.length() > 0) {
                state.autoRotationAxis.copy(newAxis);
            }

            const dragSpeed = state.currentAngularVelocity.length();
            if (dragSpeed <= props.autoRotationSpeed) {
                state.currentAngularVelocity.copy(state.autoRotationAxis).multiplyScalar(props.autoRotationSpeed);
            }
        }
    }

    // 检查点击事件
    if (event.changedTouches.length > 0 && state.mouse) {
        const touch = event.changedTouches[0];
        state.mouse.x = (touch.clientX / window.innerWidth) * 2 - 1;
        state.mouse.y = -(touch.clientY / window.innerHeight) * 2 + 1;
        checkIntersection();
    }
}

// 鼠标点击事件
function onMouseClick(event: MouseEvent) {
    event.preventDefault();
    if (state.mouse) {
        state.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        state.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        checkIntersection();
    }
}

// 窗口大小调整事件
function onWindowResize() {
    if (!container.value || !state.camera || !state.renderer) return;

    state.camera.aspect = container.value.clientWidth / container.value.clientHeight;
    state.camera.updateProjectionMatrix();
    state.renderer.setSize(
        container.value.clientWidth,
        container.value.clientHeight
    );
}

// 手势开始事件
function onGestureStart(e: Event) {
    e.preventDefault();
}

// 检查交叉点
function checkIntersection() {
    if (!state.raycaster || !state.mouse || !state.camera) return;

    state.raycaster.setFromCamera(state.mouse, state.camera);
    const intersects = state.raycaster.intersectObjects(state.smallBalls as THREE.Object3D[]);

    if (intersects.length > 0) {
        const intersectedBall = intersects[0].object as THREE.Mesh;
        const index = state.smallBalls.indexOf(intersectedBall);
        if (index !== -1) {
            const labelInfo = state.labelSprites[index];
            showLabelInfo(labelInfo);
        }
    }
}

// 显示标签信息
function showLabelInfo(labelInfo: { labelText: string }) {
    emit('ball-clicked', labelInfo.labelText);
}

// 动画循环
function animate() {
    requestAnimationFrame(animate);

    if (!state.sphere || !state.renderer || !state.scene || !state.camera || !state.currentAngularVelocity) return;

    if (!state.isDragging) {
        const deltaQuat = new THREE.Quaternion().setFromEuler(
            new THREE.Euler(
                state.currentAngularVelocity.x,
                state.currentAngularVelocity.y,
                state.currentAngularVelocity.z,
                'XYZ'
            )
        );
        state.sphere.quaternion.multiplyQuaternions(deltaQuat, state.sphere.quaternion);

        const currentSpeed = state.currentAngularVelocity.length();

        if (currentSpeed > props.autoRotationSpeed) {
            state.currentAngularVelocity.multiplyScalar(state.decayRate);

            if (state.currentAngularVelocity.length() < props.autoRotationSpeed) {
                state.currentAngularVelocity.copy(state.autoRotationAxis).multiplyScalar(props.autoRotationSpeed);
            }
        } else if (currentSpeed < props.autoRotationSpeed) {
            state.currentAngularVelocity.multiplyScalar(state.increaseRate);

            if (state.currentAngularVelocity.length() > props.autoRotationSpeed) {
                state.currentAngularVelocity.copy(state.autoRotationAxis).multiplyScalar(props.autoRotationSpeed);
            }
        } else {
            state.currentAngularVelocity.copy(state.autoRotationAxis).multiplyScalar(props.autoRotationSpeed);
        }
    }

    // 更新标签位置和滚动效果
    state.labelSprites.forEach(({ sprite, smallBall, texture, needMarquee }) => {
        smallBall.updateMatrixWorld();
        const smallBallWorldPos = new THREE.Vector3();
        smallBall.getWorldPosition(smallBallWorldPos);

        const upOffset = new THREE.Vector3(0, 0.3, 0);

        sprite.position.copy(smallBallWorldPos).add(upOffset);

        if (needMarquee) {
            texture.offset.x += props.labelTextSpeed;

            if (texture.offset.x > 1) {
                texture.offset.x = 0;
            }
        }
    });

    state.renderer.render(state.scene, state.camera);
}

// 获取随机亮色
function getRandomBrightColor() {
    const hue = Math.floor(Math.random() * 360);
    const saturation = Math.floor(Math.random() * 40 + 10);
    const lightness = Math.floor(Math.random() * 40 + 40);

    const rgb = hslToRgb(hue, saturation, lightness);

    return (rgb.r << 16) | (rgb.g << 8) | rgb.b;
}

// HSL 转 RGB
function hslToRgb(h: number, s: number, l: number) {
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
}

// 获取随机昵称
function getRandomNickname() {
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
        return getRandomNickname();
    } else if (nickname.length > 22) {
        return nickname.slice(0, 22);
    }

    return nickname;
}

// 生命周期钩子
onMounted(() => {
    initThree();
    animate();
    addEventListeners();
});

onBeforeUnmount(() => {
    removeEventListeners();
});
</script>

<style scoped>
.sphere-container {
    width: 100%;
    height: 100%;
    margin: 0;
    touch-action: none;
}
</style>
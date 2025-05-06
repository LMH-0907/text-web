// script.js
// 登录页面相关
document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const loginBtn = document.getElementById('login-btn');
    const usernameGroup = document.getElementById('username-group');
    const passwordGroup = document.getElementById('password-group');
    const errorMessage = document.getElementById('error-message');
    const splashScreen = document.getElementById('splash-screen');
    const splashVideo = document.getElementById('splash-video');
    const mainContent = document.getElementById('main-content');

    // 正确的用户名和密码
    const correctUsername = '林';
    const correctPassword = '123asdfghjkl';

    // 登录尝试计数
    let loginAttempts = 0;
    // 锁定时长（5分钟）
    const lockDuration = 5 * 60 * 1000;
    // 锁定状态
    let isLocked = false;
    // 锁定时的开始时间
    let lockStartTime = 0;

    // 显示输入框动画
    setTimeout(() => {
        usernameGroup.classList.add('active');
    }, 500);

    setTimeout(() => {
        passwordGroup.classList.add('active');
    }, 1000);

    setTimeout(() => {
        loginBtn.classList.add('active');
    }, 1500);

    // 回车键处理
    usernameInput.addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            passwordInput.focus();
        }
    });

    passwordInput.addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            handleLogin();
        }
    });

    // 登录按钮点击事件
    loginBtn.addEventListener('click', handleLogin);

    // 登录处理函数
    function handleLogin() {
        // 如果被锁定，忽略登录尝试
        if (isLocked) {
            showErrorMessage('账户已锁定，请5分钟后重试');
            return;
        }

        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        // 验证用户名和密码
        if (username === correctUsername && password === correctPassword) {
            // 登录成功
            loginAttempts = 0;
            errorMessage.style.display = 'none';
            playSplashVideo();
        } else {
            // 登录失败
            loginAttempts++;
            
            // 清空输入框
            usernameInput.value = '';
            passwordInput.value = '';
            
            // 显示错误消息
            if (loginAttempts === 1) {
                showErrorMessage('用户名或密码错误，请重试');
            } else if (loginAttempts === 2) {
                showErrorMessage('用户名或密码错误，请重试（第2次）');
            } else if (loginAttempts >= 3) {
                lockAccount();
                return;
            }

            // 自动聚焦到用户名输入框
            usernameInput.focus();
        }
    }

    // 显示错误消息
    function showErrorMessage(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
    }

    // 锁定账户
    function lockAccount() {
        isLocked = true;
        showErrorMessage('账户已被锁定，请5分钟后重试');
        lockStartTime = Date.now();
        
        // 5分钟后解锁
        setTimeout(() => {
            isLocked = false;
            errorMessage.style.display = 'none';
        }, lockDuration);
    }

    // 播放开机动画
    function playSplashVideo() {
        // 隐藏登录界面
        document.querySelector('.login-container').style.display = 'none';
        
        // 显示开机动画界面
        splashScreen.style.display = 'flex';
        splashVideo.play();
        
        // 视频播放结束时显示主内容
        splashVideo.addEventListener('ended', function() {
            splashScreen.style.display = 'none';
            mainContent.style.display = 'block';
        }, { once: true });
    }

    // 检查锁定状态
    function checkLockStatus() {
        if (isLocked) {
            const elapsed = Date.now() - lockStartTime;
            const remaining = lockDuration - elapsed;
            
            if (remaining <= 0) {
                isLocked = false;
                errorMessage.style.display = 'none';
            } else {
                const minutes = Math.floor(remaining / (60 * 1000));
                const seconds = Math.floor((remaining % (60 * 1000)) / 1000);
                showErrorMessage(`账户已锁定，请${minutes}分${seconds}秒后重试`);
            }
        }
    }

    // 定期检查锁定状态
    setInterval(checkLockStatus, 1000);

    // 动态生成视频列表
    const videoListContainer = document.getElementById('video-list');
    videoData.forEach((video, index) => {
        const videoItem = document.createElement('div');
        videoItem.className = 'video-item';
        videoItem.onclick = function() { selectVideo(this); };
        
        const videoImg = document.createElement('img');
        videoImg.src = video.src;
        videoImg.alt = video.name;
        videoItem.appendChild(videoImg);
        
        videoListContainer.appendChild(videoItem);
    });

    // 动态生成背景图片列表
    const imageContainer = document.getElementById('image-container');
    backgroundImageData.forEach((image, index) => {
        const img = document.createElement('img');
        img.src = image.src;
        img.alt = `图片 ${index + 1}`;
        img.onclick = function() { changeBackground(image.src, this); };
        imageContainer.appendChild(img);
    });
});

// 视频选择功能
let selectedVideo = null;

function selectVideo(videoElement) {
    if (selectedVideo) selectedVideo.classList.remove('selected');
    videoElement.classList.add('selected');
    selectedVideo = videoElement;
    
    const videoPlayer = document.getElementById('main-video');
    const videoIndex = Array.from(document.querySelectorAll('.video-item')).indexOf(videoElement) + 1;
    videoPlayer.src = `video/video${videoIndex}.mp4`;
    videoPlayer.load();
    videoPlayer.play();
}

// 背景切换功能
function changeBackground(imagePath, imgElement) {
    document.body.style.backgroundImage = `url('${imagePath}')`;
    document.querySelectorAll('.image-container img').forEach(img => {
        img.classList.remove('active');
    });
    imgElement.classList.add('active');
}

// 图片列切换功能
function toggleImageContainer() {
    const container = document.querySelector('.image-container');
    container.style.display = container.style.display === 'flex' ? 'none' : 'flex';
}
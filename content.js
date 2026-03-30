'use strict';

// 把你原来的核心代码包装成一个字符串
const actualCode = `
  const lactRefreshInterval = 5 * 60 * 1000; // 5 mins
  const initialLactDelay = 1000;

  // 欺骗 Page Visibility API，让 YouTube 以为你在前台
  try {
      Object.defineProperties(document, { 
          'hidden': { value: false }, 
          'visibilityState': { value: 'visible' } 
      });
  } catch(e) {
      // 捕获异常防止页面已有其他严格限制导致脚本中断
  }
  
  window.addEventListener('visibilitychange', e => e.stopImmediatePropagation(), true);

  // 维持 _lact (Last Active) 的活跃状态，防止视频自动暂停
  function waitForYoutubeLactInit(delay = initialLactDelay) {
    if (window.hasOwnProperty('_lact')) { 
      window.setInterval(() => { window._lact = Date.now(); }, lactRefreshInterval); 
    } else { 
      window.setTimeout(() => waitForYoutubeLactInit(delay * 2), delay); 
    }
  }
  waitForYoutubeLactInit();
`;

// 动态创建 script 标签，将代码注入到页面的“主世界”中
const script = document.createElement('script');
script.textContent = actualCode;
// 插入到页面后立即执行
(document.head || document.documentElement).appendChild(script);
// 执行完后立刻删掉标签，做到无痕注入
script.remove();
<template>
  <div class="page-footer">
    <div class="footer-content">
      <!-- 帮助中心 -->
      <div class="footer-section help-center">
        <h3>帮助中心</h3>
        <ul>
          <li v-for="item in helpLinks" :key="item.text">
            <a href="#" @click.prevent="handleFooterLink(item.action)">
              <font-awesome-icon :icon="item.icon" />
              {{ item.text }}
            </a>
          </li>
        </ul>
      </div>

      <!-- 联系方式 -->
      <div class="footer-section contact-info">
        <h3>联系我们</h3>
        <div class="contact-methods">
          <div class="contact-item">
            <font-awesome-icon icon="phone" />
            <span>客服热线：400-123-4567</span>
          </div>
          <div class="contact-item">
            <font-awesome-icon icon="envelope" />
            <span>邮箱：support@example.com</span>
          </div>
          <div class="contact-item">
            <font-awesome-icon icon="clock" />
            <span>服务时间：9:00-22:00</span>
          </div>
        </div>
        <div class="social-media">
          <el-button circle class="social-btn weixin">
            <font-awesome-icon icon="weixin" />
            <div class="qr-popup">
              <img src="https://www.themoviedb.org/t/p/w500/qr-code.jpg" alt="微信二维码">
              <span>关注微信公众号</span>
            </div>
          </el-button>
          <el-button circle class="social-btn weibo">
            <font-awesome-icon icon="weibo" />
          </el-button>
          <el-button circle class="social-btn qq">
            <font-awesome-icon icon="qq" />
          </el-button>
        </div>
      </div>

      <!-- 下载客户端 -->
      <div class="footer-section download-apps">
        <h3>下载客户端</h3>
        <div class="app-downloads">
          <div class="app-item">
            <div class="qr-code">
              <el-image 
                src="https://www.themoviedb.org/t/p/w500/android-qr.jpg"
                fit="cover"
              >
                <template #error>
                  <div class="qr-placeholder">
                    <font-awesome-icon icon="qrcode" />
                    <span>Android版</span>
                  </div>
                </template>
              </el-image>
            </div>
            <span>Android版</span>
          </div>
          <div class="app-item">
            <div class="qr-code">
              <el-image 
                src="https://www.themoviedb.org/t/p/w500/ios-qr.jpg"
                fit="cover"
              >
                <template #error>
                  <div class="qr-placeholder">
                    <font-awesome-icon icon="qrcode" />
                    <span>iOS版</span>
                  </div>
                </template>
              </el-image>
            </div>
            <span>iOS版</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部版权信息 -->
    <div class="footer-bottom">
      <div class="footer-nav">
        <a href="#" @click.prevent="handleFooterLink('about')">关于我们</a>
        <a href="#" @click.prevent="handleFooterLink('privacy')">隐私政策</a>
        <a href="#" @click.prevent="handleFooterLink('terms')">服务条款</a>
        <a href="#" @click.prevent="handleFooterLink('feedback')">意见反馈</a>
        <a href="#" @click.prevent="handleFooterLink('contact')">联系我们</a>
      </div>
      <div class="copyright">
        <p>© 2024 视频网站 All Rights Reserved</p>
        <p>京ICP备12345678号-1 | 京网文[2024]1234-567号</p>
      </div>
    </div>
  </div>
</template>

<script setup>
// 帮助中心链接
const helpLinks = [
  { text: '常见问题', icon: 'question-circle', action: 'faq' },
  { text: '会员服务', icon: 'crown', action: 'vip-service' },
  { text: '意见反馈', icon: 'comment', action: 'feedback' },
  { text: '联系客服', icon: 'headset', action: 'contact' }
]

// 处理底部链接点击
const handleFooterLink = (action) => {
  console.log('Footer link clicked:', action)
  // 这里可以添加具体的处理逻辑
}
</script>

<style scoped>
.page-footer {
  background: #2d2d2d;
  padding: 60px 0 20px;
  margin-top: 60px;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;
}

.footer-section {
  h3 {
    color: #e5e5e5;
    margin: 0 0 20px 0;
    font-size: 18px;
    position: relative;
    padding-bottom: 10px;
    
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 30px;
      height: 2px;
      background: #4CAF50;
      transition: width 0.3s ease;
    }
    
    &:hover::after {
      width: 50px;
    }
  }
}

.help-center {
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  li {
    margin-bottom: 12px;
  }
  
  a {
    color: #999;
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: all 0.3s ease;
    
    &:hover {
      color: #4CAF50;
      transform: translateX(4px);
    }
  }
}

.contact-methods {
  .contact-item {
    display: flex;
    align-items: center;
    gap: 12px;
    color: #999;
    margin-bottom: 12px;
    transition: all 0.3s ease;
    
    &:hover {
      color: #4CAF50;
      transform: translateX(4px);
    }
  }
}

.social-media {
  margin-top: 20px;
  display: flex;
  gap: 12px;
  
  .social-btn {
    background: transparent;
    border: 1px solid #404040;
    color: #999;
    transition: all 0.3s ease;
    position: relative;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      
      &.weixin {
        background: #07C160;
        border-color: #07C160;
        color: white;
        
        .qr-popup {
          opacity: 1;
          transform: translateY(0);
          visibility: visible;
        }
      }
      
      &.weibo {
        background: #E6162D;
        border-color: #E6162D;
        color: white;
      }
      
      &.qq {
        background: #12B7F5;
        border-color: #12B7F5;
        color: white;
      }
    }
  }
}

.qr-popup {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%) translateY(10px);
  background: white;
  padding: 12px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  
  img {
    width: 120px;
    height: 120px;
    border-radius: 4px;
  }
  
  span {
    display: block;
    text-align: center;
    color: #333;
    font-size: 12px;
    margin-top: 8px;
  }
}

.app-downloads {
  display: flex;
  gap: 20px;
  
  .app-item {
    text-align: center;
    
    .qr-code {
      width: 120px;
      height: 120px;
      margin-bottom: 8px;
      border-radius: 8px;
      overflow: hidden;
      transition: all 0.3s ease;
      
      &:hover {
        transform: scale(1.05);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      }
    }
    
    span {
      font-size: 14px;
      color: #999;
    }
  }
}

.qr-placeholder {
  width: 100%;
  height: 100%;
  background: #404040;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #666;
  gap: 8px;
  
  .fa-icon {
    font-size: 24px;
  }
  
  span {
    font-size: 12px;
  }
}

.footer-bottom {
  max-width: 1200px;
  margin: 40px auto 0;
  padding: 20px;
  border-top: 1px solid #404040;
  text-align: center;
}

.footer-nav {
  margin-bottom: 20px;
  
  a {
    color: #999;
    text-decoration: none;
    margin: 0 15px;
    transition: color 0.3s ease;
    
    &:hover {
      color: #4CAF50;
    }
  }
}

.copyright {
  p {
    margin: 5px 0;
    font-size: 12px;
    color: #666;
  }
}

/* 响应式适配 */
@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr;
    gap: 40px;
  }
  
  .app-downloads {
    justify-content: center;
  }
  
  .footer-nav {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 10px;
    
    a {
      margin: 0;
    }
  }
}
</style> 
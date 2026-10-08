<template>
  <div class="settings-page font-general">

    <!-- Page Header -->
    <div class="page-header">
      <div class="page-header-left">
        <div class="page-header-icon">
          <i class="bi bi-gear-wide-connected"></i>
        </div>
        <div>
          <h4 class="page-title">Cài Đặt Hệ Thống</h4>
          <p class="page-subtitle">Quản lý toàn bộ cấu hình website và vận hành</p>
        </div>
      </div>
      <div class="page-header-right d-none d-md-flex align-items-center gap-2">
        <span class="system-status">
          <span class="status-dot"></span>
          Hệ thống hoạt động bình thường
        </span>
      </div>
    </div>

    <!-- Main Layout -->
    <div class="settings-layout">

      <!-- Sidebar -->
      <aside class="settings-sidebar">
        <div v-for="group in navGroups" :key="group.label" class="nav-group">
          <div class="nav-group-label">{{ group.label }}</div>
          <button
            v-for="item in group.items"
            :key="item.id"
            class="nav-item"
            :class="{ active: activePanel === item.id }"
            @click="setPanel(item.id)"
          >
            <span class="nav-item-icon" :class="`nav-icon--${item.color}`">
              <i :class="`bi bi-${item.icon}`"></i>
            </span>
            <span class="nav-item-label">{{ item.label }}</span>
            <span v-if="item.badge" class="nav-item-badge" :class="`badge--${item.badgeColor}`">
              {{ item.badge }}
            </span>
            <i class="bi bi-chevron-right nav-item-arrow"></i>
          </button>
        </div>
      </aside>

      <!-- Content -->
      <div class="settings-content">

        <!-- ══════════════════════════════
             PANEL: Cấu hình chung
        ══════════════════════════════ -->
        <div v-show="activePanel === 'general'" class="panel">
          <div class="panel-header">
            <div class="panel-title-wrap">
              <h5 class="panel-title">Cấu Hình Chung</h5>
              <p class="panel-desc">Thông tin cơ bản và tùy chọn hiển thị của website</p>
            </div>
          </div>

          <!-- Maintenance alert -->
          <div v-if="general.maintenanceMode" class="alert-banner alert-warning">
            <i class="bi bi-exclamation-triangle-fill me-2"></i>
            <strong>Website đang bảo trì</strong> — Khách hàng không thể truy cập lúc này.
          </div>

          <!-- Toggle cards -->
          <div class="toggle-card-grid">
            <div class="toggle-card">
              <div class="toggle-card-icon toggle-card-icon--orange">
                <i class="bi bi-cone-striped"></i>
              </div>
              <div class="toggle-card-body">
                <div class="toggle-card-title">Chế độ bảo trì</div>
                <div class="toggle-card-desc">Tạm đóng website với khách hàng</div>
              </div>
              <label class="switch">
                <input type="checkbox" v-model="general.maintenanceMode">
                <span class="switch-slider"></span>
              </label>
            </div>
            <div class="toggle-card">
              <div class="toggle-card-icon toggle-card-icon--blue">
                <i class="bi bi-tags"></i>
              </div>
              <div class="toggle-card-body">
                <div class="toggle-card-title">Hiển thị giá công khai</div>
                <div class="toggle-card-desc">Khách chưa đăng nhập xem được giá</div>
              </div>
              <label class="switch">
                <input type="checkbox" v-model="general.showPricePublic">
                <span class="switch-slider"></span>
              </label>
            </div>
            <div class="toggle-card">
              <div class="toggle-card-icon toggle-card-icon--green">
                <i class="bi bi-star-half"></i>
              </div>
              <div class="toggle-card-body">
                <div class="toggle-card-title">Cho phép đánh giá</div>
                <div class="toggle-card-desc">Khách hàng gửi review & nhận xét</div>
              </div>
              <label class="switch">
                <input type="checkbox" v-model="general.allowReviews">
                <span class="switch-slider"></span>
              </label>
            </div>
            <div class="toggle-card">
              <div class="toggle-card-icon toggle-card-icon--purple">
                <i class="bi bi-chat-dots"></i>
              </div>
              <div class="toggle-card-body">
                <div class="toggle-card-title">Live Chat</div>
                <div class="toggle-card-desc">Hiển thị nút chat trực tiếp</div>
              </div>
              <label class="switch">
                <input type="checkbox" v-model="general.liveChat">
                <span class="switch-slider"></span>
              </label>
            </div>
          </div>

          <div class="form-section">
            <div class="form-section-title">Thông tin website</div>
            <div class="form-row-2">
              <div class="form-group">
                <label class="form-label">Tên website <span class="required">*</span></label>
                <input class="form-input" v-model="general.siteName" type="text" placeholder="Tên website...">
              </div>
              <div class="form-group">
                <label class="form-label">Hotline chính <span class="required">*</span></label>
                <div class="input-prefix-wrap">
                  <span class="input-prefix"><i class="bi bi-telephone"></i></span>
                  <input class="form-input has-prefix" v-model="general.hotline" type="text" placeholder="0786.667.447">
                </div>
              </div>
            </div>
            <div class="form-row-2">
              <div class="form-group">
                <label class="form-label">Múi giờ hệ thống</label>
                <select class="form-select" v-model="general.timezone">
                  <option value="Asia/Ho_Chi_Minh">Asia/Ho_Chi_Minh (GMT+7)</option>
                  <option value="Asia/Bangkok">Asia/Bangkok (GMT+7)</option>
                  <option value="UTC">UTC (GMT+0)</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Định dạng tiền tệ</label>
                <select class="form-select" v-model="general.currency">
                  <option value="VND">VND — ₫ (Việt Nam Đồng)</option>
                  <option value="USD">USD — $ (US Dollar)</option>
                </select>
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Địa chỉ trụ sở</label>
              <input class="form-input" v-model="general.address" type="text" placeholder="Địa chỉ...">
            </div>
            <div class="form-group">
              <label class="form-label">Email liên hệ</label>
              <input class="form-input" v-model="general.contactEmail" type="email" placeholder="contact@...">
            </div>
          </div>

          <div class="panel-footer">
            <button class="btn-secondary" @click="resetForm('general')">
              <i class="bi bi-arrow-counterclockwise me-1"></i> Hoàn tác
            </button>
            <button class="btn-primary" @click="saveSettings('general')">
              <i class="bi bi-check-lg me-1"></i> Lưu cấu hình
            </button>
          </div>
        </div>

        <!-- ══════════════════════════════
             PANEL: Thương hiệu
        ══════════════════════════════ -->
        <div v-show="activePanel === 'branding'" class="panel">
          <div class="panel-header">
            <div class="panel-title-wrap">
              <h5 class="panel-title">Thương Hiệu & Logo</h5>
              <p class="panel-desc">Nhận diện thương hiệu, màu sắc và hình ảnh đại diện</p>
            </div>
          </div>

          <div class="form-section">
            <div class="form-section-title">Hình ảnh thương hiệu</div>
            <div class="upload-row">
              <div class="upload-box">
                <div class="upload-preview">
                  <i class="bi bi-image text-muted fs-3"></i>
                </div>
                <div class="upload-info">
                  <div class="upload-label">Logo chính</div>
                  <div class="upload-hint">PNG / SVG — tối đa 2MB, nền trong suốt</div>
                  <label class="upload-btn">
                    <i class="bi bi-upload me-1"></i> Chọn file
                    <input type="file" accept="image/*" class="d-none" @change="handleUpload('logo', $event)">
                  </label>
                </div>
              </div>
              <div class="upload-box">
                <div class="upload-preview upload-preview--small">
                  <i class="bi bi-asterisk text-muted"></i>
                </div>
                <div class="upload-info">
                  <div class="upload-label">Favicon</div>
                  <div class="upload-hint">32×32px — .ico hoặc .png</div>
                  <label class="upload-btn">
                    <i class="bi bi-upload me-1"></i> Chọn file
                    <input type="file" accept="image/*" class="d-none" @change="handleUpload('favicon', $event)">
                  </label>
                </div>
              </div>
              <div class="upload-box">
                <div class="upload-preview">
                  <i class="bi bi-share-fill text-muted fs-3"></i>
                </div>
                <div class="upload-info">
                  <div class="upload-label">Ảnh OG (Social Share)</div>
                  <div class="upload-hint">1200×630px — JPG/PNG</div>
                  <label class="upload-btn">
                    <i class="bi bi-upload me-1"></i> Chọn file
                    <input type="file" accept="image/*" class="d-none" @change="handleUpload('og', $event)">
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div class="form-section">
            <div class="form-section-title">Màu sắc & Typography</div>
            <div class="form-row-2">
              <div class="form-group">
                <label class="form-label">Màu chủ đạo (Primary)</label>
                <div class="color-input-wrap">
                  <input type="color" class="color-picker" v-model="branding.primaryColor">
                  <input class="form-input" v-model="branding.primaryColor" type="text" style="font-family: monospace; text-transform: uppercase;">
                </div>
                <div class="color-preview" :style="{ background: branding.primaryColor }"></div>
              </div>
              <div class="form-group">
                <label class="form-label">Màu phụ (Secondary)</label>
                <div class="color-input-wrap">
                  <input type="color" class="color-picker" v-model="branding.secondaryColor">
                  <input class="form-input" v-model="branding.secondaryColor" type="text" style="font-family: monospace; text-transform: uppercase;">
                </div>
                <div class="color-preview" :style="{ background: branding.secondaryColor }"></div>
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Slogan / Tagline</label>
              <input class="form-input" v-model="branding.tagline" type="text" placeholder="Đối tác F&B tin cậy...">
            </div>
            <div class="form-group">
              <label class="form-label">Copyright footer</label>
              <input class="form-input" v-model="branding.copyright" type="text">
            </div>
          </div>

          <div class="panel-footer">
            <button class="btn-secondary" @click="resetForm('branding')">
              <i class="bi bi-arrow-counterclockwise me-1"></i> Hoàn tác
            </button>
            <button class="btn-primary" @click="saveSettings('branding')">
              <i class="bi bi-check-lg me-1"></i> Lưu thay đổi
            </button>
          </div>
        </div>

        <!-- ══════════════════════════════
             PANEL: SEO
        ══════════════════════════════ -->
        <div v-show="activePanel === 'seo'" class="panel">
          <div class="panel-header">
            <div class="panel-title-wrap">
              <h5 class="panel-title">SEO & Meta Tags</h5>
              <p class="panel-desc">Tối ưu công cụ tìm kiếm và mạng xã hội</p>
            </div>
          </div>

          <div class="form-section">
            <div class="form-section-title">Meta cơ bản</div>
            <div class="form-group">
              <label class="form-label">
                Meta Title
                <span class="char-count" :class="{ 'char-warn': seo.metaTitle.length > 60 }">
                  {{ seo.metaTitle.length }}/60
                </span>
              </label>
              <input class="form-input" v-model="seo.metaTitle" type="text" placeholder="Tiêu đề trang chủ...">
            </div>
            <div class="form-group">
              <label class="form-label">
                Meta Description
                <span class="char-count" :class="{ 'char-warn': seo.metaDesc.length > 160 }">
                  {{ seo.metaDesc.length }}/160
                </span>
              </label>
              <textarea class="form-input" v-model="seo.metaDesc" rows="3" style="resize: vertical;" placeholder="Mô tả trang chủ..."></textarea>
            </div>
            <div class="form-group">
              <label class="form-label">Keywords (phân cách bằng dấu phẩy)</label>
              <input class="form-input" v-model="seo.keywords" type="text" placeholder="horeca, thiết bị fnb, sứ long phương...">
            </div>
          </div>

          <div class="form-section">
            <div class="form-section-title">Công cụ phân tích & xác minh</div>
            <div class="form-row-2">
              <div class="form-group">
                <label class="form-label">Google Analytics 4 ID</label>
                <div class="input-prefix-wrap">
                  <span class="input-prefix" style="font-size: 11px; font-weight: 700;">GA4</span>
                  <input class="form-input has-prefix" v-model="seo.ga4Id" type="text" placeholder="G-XXXXXXXXXX" style="font-family: monospace;">
                </div>
              </div>
              <div class="form-group">
                <label class="form-label">Google Tag Manager ID</label>
                <div class="input-prefix-wrap">
                  <span class="input-prefix" style="font-size: 11px; font-weight: 700;">GTM</span>
                  <input class="form-input has-prefix" v-model="seo.gtmId" type="text" placeholder="GTM-XXXXXXX" style="font-family: monospace;">
                </div>
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Google Search Console verification token</label>
              <input class="form-input" v-model="seo.gscToken" type="text" placeholder="verification token..." style="font-family: monospace;">
            </div>
            <div class="form-group">
              <label class="form-label">Facebook Pixel ID</label>
              <input class="form-input" v-model="seo.fbPixelId" type="text" placeholder="1234567890" style="font-family: monospace;">
            </div>
          </div>

          <div class="panel-footer">
            <button class="btn-secondary" @click="resetForm('seo')">
              <i class="bi bi-arrow-counterclockwise me-1"></i> Hoàn tác
            </button>
            <button class="btn-primary" @click="saveSettings('seo')">
              <i class="bi bi-check-lg me-1"></i> Lưu SEO
            </button>
          </div>
        </div>

        <!-- ══════════════════════════════
             PANEL: Bảo mật
        ══════════════════════════════ -->
        <div v-show="activePanel === 'security'" class="panel">
          <div class="panel-header">
            <div class="panel-title-wrap">
              <h5 class="panel-title">Bảo Mật</h5>
              <p class="panel-desc">Kiểm soát quyền truy cập và bảo vệ tài khoản</p>
            </div>
          </div>

          <div class="toggle-card-grid">
            <div class="toggle-card">
              <div class="toggle-card-icon toggle-card-icon--blue">
                <i class="bi bi-phone"></i>
              </div>
              <div class="toggle-card-body">
                <div class="toggle-card-title">Xác thực 2 bước (2FA)</div>
                <div class="toggle-card-desc">Admin phải nhập OTP khi đăng nhập</div>
              </div>
              <label class="switch">
                <input type="checkbox" v-model="security.twoFactor">
                <span class="switch-slider"></span>
              </label>
            </div>
            <div class="toggle-card">
              <div class="toggle-card-icon toggle-card-icon--red">
                <i class="bi bi-shield-x"></i>
              </div>
              <div class="toggle-card-body">
                <div class="toggle-card-title">Khoá sau đăng nhập sai</div>
                <div class="toggle-card-desc">Khoá tài khoản sau nhiều lần sai</div>
              </div>
              <label class="switch">
                <input type="checkbox" v-model="security.lockOnFail">
                <span class="switch-slider"></span>
              </label>
            </div>
            <div class="toggle-card">
              <div class="toggle-card-icon toggle-card-icon--purple">
                <i class="bi bi-geo-alt"></i>
              </div>
              <div class="toggle-card-body">
                <div class="toggle-card-title">Giới hạn IP Việt Nam</div>
                <div class="toggle-card-desc">Chặn đăng nhập từ IP nước ngoài</div>
              </div>
              <label class="switch">
                <input type="checkbox" v-model="security.ipVnOnly">
                <span class="switch-slider"></span>
              </label>
            </div>
            <div class="toggle-card">
              <div class="toggle-card-icon toggle-card-icon--amber">
                <i class="bi bi-clock-history"></i>
              </div>
              <div class="toggle-card-body">
                <div class="toggle-card-title">Ghi log hoạt động admin</div>
                <div class="toggle-card-desc">Lưu lịch sử thao tác của admin</div>
              </div>
              <label class="switch">
                <input type="checkbox" v-model="security.activityLog">
                <span class="switch-slider"></span>
              </label>
            </div>
          </div>

          <div class="form-section">
            <div class="form-section-title">Cấu hình phiên đăng nhập</div>
            <div class="form-row-2">
              <div class="form-group">
                <label class="form-label">Thời gian hết phiên (phút)</label>
                <input class="form-input" v-model.number="security.sessionTimeout" type="number" min="5" max="1440">
              </div>
              <div class="form-group">
                <label class="form-label">Số lần đăng nhập sai tối đa</label>
                <input class="form-input" v-model.number="security.maxLoginAttempts" type="number" min="3" max="20">
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Độ dài mật khẩu tối thiểu</label>
              <input class="form-input" v-model.number="security.minPasswordLength" type="number" min="6" max="32" style="width: 120px;">
            </div>
          </div>

          <div class="panel-footer">
            <button class="btn-secondary" @click="resetForm('security')">
              <i class="bi bi-arrow-counterclockwise me-1"></i> Hoàn tác
            </button>
            <button class="btn-primary" @click="saveSettings('security')">
              <i class="bi bi-check-lg me-1"></i> Lưu bảo mật
            </button>
          </div>
        </div>

        <!-- ══════════════════════════════
             PANEL: Email & SMS
        ══════════════════════════════ -->
        <div v-show="activePanel === 'email'" class="panel">
          <div class="panel-header">
            <div class="panel-title-wrap">
              <h5 class="panel-title">Email & SMS</h5>
              <p class="panel-desc">Cấu hình SMTP và nhà cung cấp SMS để gửi thông báo</p>
            </div>
          </div>

          <div class="form-section">
            <div class="form-section-title">Cấu hình SMTP</div>
            <div class="form-row-2">
              <div class="form-group">
                <label class="form-label">SMTP Host <span class="required">*</span></label>
                <input class="form-input" v-model="email.smtpHost" type="text" placeholder="smtp.gmail.com" style="font-family: monospace;">
              </div>
              <div class="form-group">
                <label class="form-label">SMTP Port</label>
                <select class="form-select" v-model="email.smtpPort">
                  <option value="587">587 (TLS)</option>
                  <option value="465">465 (SSL)</option>
                  <option value="25">25 (Không mã hoá)</option>
                </select>
              </div>
            </div>
            <div class="form-row-2">
              <div class="form-group">
                <label class="form-label">Username / Email</label>
                <input class="form-input" v-model="email.smtpUser" type="text" placeholder="your@email.com">
              </div>
              <div class="form-group">
                <label class="form-label">Mật khẩu / App Password</label>
                <div class="input-suffix-wrap">
                  <input class="form-input has-suffix" v-model="email.smtpPass" :type="showSmtpPass ? 'text' : 'password'" placeholder="••••••••">
                  <button class="input-suffix-btn" @click="showSmtpPass = !showSmtpPass" type="button">
                    <i :class="`bi bi-${showSmtpPass ? 'eye-slash' : 'eye'}`"></i>
                  </button>
                </div>
              </div>
            </div>
            <div class="form-row-2">
              <div class="form-group">
                <label class="form-label">Email gửi đi (From)</label>
                <input class="form-input" v-model="email.fromEmail" type="email" placeholder="no-reply@onehoreca.vn">
              </div>
              <div class="form-group">
                <label class="form-label">Tên hiển thị</label>
                <input class="form-input" v-model="email.fromName" type="text" placeholder="OneHoreca System">
              </div>
            </div>
            <div class="test-connection-row">
              <input class="form-input" v-model="email.testTo" type="email" placeholder="Nhập email để kiểm tra kết nối..." style="flex: 1;">
              <button class="btn-outline" @click="testEmail" :disabled="testingEmail">
                <i class="bi bi-send me-1"></i>
                {{ testingEmail ? 'Đang gửi...' : 'Gửi email test' }}
              </button>
            </div>
            <div v-if="emailTestResult" class="test-result" :class="`test-result--${emailTestResult.type}`">
              <i :class="`bi bi-${emailTestResult.type === 'success' ? 'check-circle' : 'x-circle'} me-2`"></i>
              {{ emailTestResult.message }}
            </div>
          </div>

          <div class="form-section">
            <div class="form-section-title">Cấu hình SMS (tùy chọn)</div>
            <div class="provider-tabs">
              <button
                v-for="p in smsProviders"
                :key="p.id"
                class="provider-tab"
                :class="{ active: email.smsProvider === p.id }"
                @click="email.smsProvider = p.id"
              >{{ p.label }}</button>
            </div>
            <div class="form-row-2" style="margin-top: 1rem;">
              <div class="form-group">
                <label class="form-label">API Key</label>
                <input class="form-input" v-model="email.smsApiKey" type="text" placeholder="API Key..." style="font-family: monospace;">
              </div>
              <div class="form-group">
                <label class="form-label">Tên thương hiệu (Brandname)</label>
                <input class="form-input" v-model="email.smsBrandname" type="text" placeholder="ONEHORECA">
              </div>
            </div>
          </div>

          <div class="panel-footer">
            <button class="btn-secondary" @click="resetForm('email')">
              <i class="bi bi-arrow-counterclockwise me-1"></i> Hoàn tác
            </button>
            <button class="btn-primary" @click="saveSettings('email')">
              <i class="bi bi-check-lg me-1"></i> Lưu cài đặt
            </button>
          </div>
        </div>

        <!-- ══════════════════════════════
             PANEL: Thanh toán
        ══════════════════════════════ -->
        <div v-show="activePanel === 'payment'" class="panel">
          <div class="panel-header">
            <div class="panel-title-wrap">
              <h5 class="panel-title">Cổng Thanh Toán</h5>
              <p class="panel-desc">Bật / tắt và cấu hình từng phương thức thanh toán</p>
            </div>
          </div>

          <div class="payment-card-list">
            <div
              v-for="gateway in payment.gateways"
              :key="gateway.id"
              class="payment-card"
              :class="{ 'payment-card--active': gateway.enabled }"
            >
              <div class="payment-card-top">
                <div class="payment-card-icon" :style="{ background: gateway.bgColor }">
                  <i :class="`bi bi-${gateway.icon}`" :style="{ color: gateway.iconColor }"></i>
                </div>
                <div class="payment-card-info">
                  <div class="payment-card-name">{{ gateway.name }}</div>
                  <div class="payment-card-desc">{{ gateway.desc }}</div>
                </div>
                <label class="switch ms-auto">
                  <input type="checkbox" v-model="gateway.enabled">
                  <span class="switch-slider"></span>
                </label>
              </div>
              <div v-if="gateway.enabled && gateway.hasConfig" class="payment-card-config">
                <div class="form-row-2">
                  <div class="form-group" v-if="gateway.fields.includes('merchantId')">
                    <label class="form-label">Merchant ID</label>
                    <input class="form-input" v-model="gateway.config.merchantId" type="text" style="font-family: monospace;">
                  </div>
                  <div class="form-group" v-if="gateway.fields.includes('secretKey')">
                    <label class="form-label">Secret Key</label>
                    <input class="form-input" v-model="gateway.config.secretKey" type="password">
                  </div>
                  <div class="form-group" v-if="gateway.fields.includes('partnerCode')">
                    <label class="form-label">Partner Code</label>
                    <input class="form-input" v-model="gateway.config.partnerCode" type="text" style="font-family: monospace;">
                  </div>
                  <div class="form-group" v-if="gateway.fields.includes('accessKey')">
                    <label class="form-label">Access Key</label>
                    <input class="form-input" v-model="gateway.config.accessKey" type="text" style="font-family: monospace;">
                  </div>
                </div>
                <div class="form-row-2">
                  <div class="form-group">
                    <label class="form-label">Môi trường</label>
                    <select class="form-select" v-model="gateway.config.env">
                      <option value="sandbox">Sandbox (test)</option>
                      <option value="production">Production</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="panel-footer">
            <button class="btn-secondary" @click="resetForm('payment')">
              <i class="bi bi-arrow-counterclockwise me-1"></i> Hoàn tác
            </button>
            <button class="btn-primary" @click="saveSettings('payment')">
              <i class="bi bi-check-lg me-1"></i> Lưu thanh toán
            </button>
          </div>
        </div>

        <!-- ══════════════════════════════
             PANEL: Vận chuyển
        ══════════════════════════════ -->
        <div v-show="activePanel === 'shipping'" class="panel">
          <div class="panel-header">
            <div class="panel-title-wrap">
              <h5 class="panel-title">Vận Chuyển</h5>
              <p class="panel-desc">Cấu hình đối tác giao hàng và chính sách miễn phí ship</p>
            </div>
          </div>

          <div class="payment-card-list">
            <div
              v-for="carrier in shipping.carriers"
              :key="carrier.id"
              class="payment-card"
              :class="{ 'payment-card--active': carrier.enabled }"
            >
              <div class="payment-card-top">
                <div class="payment-card-icon" :style="{ background: carrier.bgColor }">
                  <i class="bi bi-truck" :style="{ color: carrier.iconColor }"></i>
                </div>
                <div class="payment-card-info">
                  <div class="payment-card-name">{{ carrier.name }}</div>
                  <div class="payment-card-desc">{{ carrier.desc }}</div>
                </div>
                <label class="switch ms-auto">
                  <input type="checkbox" v-model="carrier.enabled">
                  <span class="switch-slider"></span>
                </label>
              </div>
              <div v-if="carrier.enabled" class="payment-card-config">
                <div class="form-row-2">
                  <div class="form-group">
                    <label class="form-label">API Token</label>
                    <input class="form-input" v-model="carrier.apiToken" type="password" placeholder="API Token...">
                  </div>
                  <div class="form-group">
                    <label class="form-label">Shop ID</label>
                    <input class="form-input" v-model="carrier.shopId" type="text" placeholder="Shop ID..." style="font-family: monospace;">
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="form-section">
            <div class="form-section-title">Chính sách miễn phí vận chuyển</div>
            <div class="toggle-card" style="margin-bottom: 1rem;">
              <div class="toggle-card-icon toggle-card-icon--green">
                <i class="bi bi-gift"></i>
              </div>
              <div class="toggle-card-body">
                <div class="toggle-card-title">Tự động miễn phí ship</div>
                <div class="toggle-card-desc">Áp dụng khi đơn hàng đủ điều kiện</div>
              </div>
              <label class="switch">
                <input type="checkbox" v-model="shipping.freeShipping">
                <span class="switch-slider"></span>
              </label>
            </div>
            <div v-if="shipping.freeShipping" class="form-row-2">
              <div class="form-group">
                <label class="form-label">Giá trị đơn tối thiểu (₫)</label>
                <input class="form-input" v-model.number="shipping.freeShippingMin" type="number" step="50000">
              </div>
              <div class="form-group">
                <label class="form-label">Áp dụng cho khu vực</label>
                <select class="form-select" v-model="shipping.freeShippingZone">
                  <option value="all">Toàn quốc</option>
                  <option value="north">Miền Bắc</option>
                  <option value="central">Miền Trung</option>
                  <option value="south">Miền Nam</option>
                </select>
              </div>
            </div>
          </div>

          <div class="panel-footer">
            <button class="btn-secondary" @click="resetForm('shipping')">
              <i class="bi bi-arrow-counterclockwise me-1"></i> Hoàn tác
            </button>
            <button class="btn-primary" @click="saveSettings('shipping')">
              <i class="bi bi-check-lg me-1"></i> Lưu vận chuyển
            </button>
          </div>
        </div>

        <!-- ══════════════════════════════
             PANEL: Thông báo
        ══════════════════════════════ -->
        <div v-show="activePanel === 'notifications'" class="panel">
          <div class="panel-header">
            <div class="panel-title-wrap">
              <h5 class="panel-title">Thông Báo Tự Động</h5>
              <p class="panel-desc">Bật / tắt các loại thông báo gửi cho admin và khách hàng</p>
            </div>
          </div>

          <div class="notif-section">
            <div class="notif-section-title">
              <i class="bi bi-person-fill me-2"></i>Gửi cho Khách hàng
            </div>
            <div class="notif-row" v-for="n in notifications.customer" :key="n.id">
              <div class="notif-info">
                <div class="notif-label">{{ n.label }}</div>
                <div class="notif-desc">{{ n.desc }}</div>
              </div>
              <div class="notif-channels">
                <label class="channel-toggle" :class="{ active: n.email }">
                  <input type="checkbox" v-model="n.email">
                  <i class="bi bi-envelope-fill"></i> Email
                </label>
                <label class="channel-toggle" :class="{ active: n.sms }">
                  <input type="checkbox" v-model="n.sms">
                  <i class="bi bi-chat-text-fill"></i> SMS
                </label>
              </div>
            </div>
          </div>

          <div class="notif-section">
            <div class="notif-section-title">
              <i class="bi bi-shield-fill me-2"></i>Gửi cho Admin
            </div>
            <div class="notif-row" v-for="n in notifications.admin" :key="n.id">
              <div class="notif-info">
                <div class="notif-label">{{ n.label }}</div>
                <div class="notif-desc">{{ n.desc }}</div>
              </div>
              <div class="notif-channels">
                <label class="channel-toggle" :class="{ active: n.email }">
                  <input type="checkbox" v-model="n.email">
                  <i class="bi bi-envelope-fill"></i> Email
                </label>
                <label class="channel-toggle" :class="{ active: n.push }">
                  <input type="checkbox" v-model="n.push">
                  <i class="bi bi-bell-fill"></i> Push
                </label>
              </div>
            </div>
          </div>

          <div class="panel-footer">
            <button class="btn-secondary" @click="resetForm('notifications')">
              <i class="bi bi-arrow-counterclockwise me-1"></i> Hoàn tác
            </button>
            <button class="btn-primary" @click="saveSettings('notifications')">
              <i class="bi bi-check-lg me-1"></i> Lưu thông báo
            </button>
          </div>
        </div>

        <!-- ══════════════════════════════
             PANEL: Backup & Log
        ══════════════════════════════ -->
        <div v-show="activePanel === 'backup'" class="panel">
          <div class="panel-header">
            <div class="panel-title-wrap">
              <h5 class="panel-title">Backup & Nhật Ký</h5>
              <p class="panel-desc">Sao lưu dữ liệu và theo dõi hoạt động hệ thống</p>
            </div>
          </div>

          <div class="toggle-card-grid">
            <div class="toggle-card">
              <div class="toggle-card-icon toggle-card-icon--blue">
                <i class="bi bi-cloud-arrow-up"></i>
              </div>
              <div class="toggle-card-body">
                <div class="toggle-card-title">Backup tự động hàng ngày</div>
                <div class="toggle-card-desc">Lúc 2:00 AM — backup toàn bộ database</div>
              </div>
              <label class="switch">
                <input type="checkbox" v-model="backup.autoDailyBackup">
                <span class="switch-slider"></span>
              </label>
            </div>
            <div class="toggle-card">
              <div class="toggle-card-icon toggle-card-icon--green">
                <i class="bi bi-hdd-network"></i>
              </div>
              <div class="toggle-card-body">
                <div class="toggle-card-title">Lưu lên Google Drive</div>
                <div class="toggle-card-desc">Tự động upload backup lên Drive</div>
              </div>
              <label class="switch">
                <input type="checkbox" v-model="backup.backupToDrive">
                <span class="switch-slider"></span>
              </label>
            </div>
          </div>

          <div class="form-section">
            <div class="form-section-title">Danh sách backup gần đây</div>
            <div class="backup-list">
              <div v-for="file in backup.files" :key="file.name" class="backup-item">
                <div class="backup-item-icon">
                  <i class="bi bi-file-earmark-zip"></i>
                </div>
                <div class="backup-item-info">
                  <div class="backup-item-name">{{ file.name }}</div>
                  <div class="backup-item-meta">{{ file.date }} · {{ file.size }}</div>
                </div>
                <div class="backup-item-status" :class="`backup-status--${file.status}`">
                  {{ file.statusLabel }}
                </div>
                <button class="backup-item-btn" title="Tải xuống">
                  <i class="bi bi-download"></i>
                </button>
                <button class="backup-item-btn backup-item-btn--danger" title="Xoá" @click="deleteBackup(file)">
                  <i class="bi bi-trash3"></i>
                </button>
              </div>
            </div>
            <button class="btn-outline mt-3" @click="triggerBackup" :disabled="backingUp">
              <i class="bi bi-database-add me-1"></i>
              {{ backingUp ? 'Đang backup...' : 'Backup ngay' }}
            </button>
          </div>

          <div class="form-section">
            <div class="form-section-title">Cấu hình lưu trữ</div>
            <div class="form-row-2">
              <div class="form-group">
                <label class="form-label">Giữ backup trong (ngày)</label>
                <input class="form-input" v-model.number="backup.retentionDays" type="number" min="7" max="365" style="width: 120px;">
              </div>
              <div class="form-group">
                <label class="form-label">Giờ backup tự động</label>
                <input class="form-input" v-model="backup.scheduleTime" type="time" style="width: 140px;">
              </div>
            </div>
          </div>

          <div class="panel-footer">
            <button class="btn-secondary" @click="resetForm('backup')">
              <i class="bi bi-arrow-counterclockwise me-1"></i> Hoàn tác
            </button>
            <button class="btn-primary" @click="saveSettings('backup')">
              <i class="bi bi-check-lg me-1"></i> Lưu cài đặt
            </button>
          </div>
        </div>

      </div>
    </div>

    <!-- Toast Notification -->
    <transition name="toast">
      <div v-if="toast.show" class="toast-msg" :class="`toast-msg--${toast.type}`">
        <i :class="`bi bi-${toast.type === 'success' ? 'check-circle-fill' : 'x-circle-fill'} me-2`"></i>
        {{ toast.message }}
      </div>
    </transition>

  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';

// ─── Active panel ───────────────────────────────────────────────
const activePanel = ref('general');
const setPanel = (id) => { activePanel.value = id; };

// ─── Navigation ─────────────────────────────────────────────────
const navGroups = [
  {
    label: 'Chung',
    items: [
      { id: 'general',       label: 'Cấu hình chung',     icon: 'globe2',             color: 'blue' },
      { id: 'branding',      label: 'Thương hiệu & Logo',  icon: 'palette2',           color: 'purple' },
      { id: 'seo',           label: 'SEO & Meta',          icon: 'search',             color: 'teal' },
    ]
  },
  {
    label: 'Vận hành',
    items: [
      { id: 'security',      label: 'Bảo mật',             icon: 'shield-lock',        color: 'red' },
      { id: 'email',         label: 'Email & SMS',         icon: 'envelope-at',        color: 'amber' },
      { id: 'payment',       label: 'Thanh toán',          icon: 'credit-card-2-front',color: 'green' },
      { id: 'shipping',      label: 'Vận chuyển',          icon: 'truck',              color: 'orange' },
      { id: 'notifications', label: 'Thông báo',           icon: 'bell',               color: 'blue', badge: '8', badgeColor: 'amber' },
    ]
  },
  {
    label: 'Hệ thống',
    items: [
      { id: 'backup',        label: 'Backup & Nhật ký',    icon: 'database',           color: 'gray' },
    ]
  }
];

// ─── Toast ──────────────────────────────────────────────────────
const toast = reactive({ show: false, message: '', type: 'success' });
const showToast = (message, type = 'success') => {
  toast.show = true; toast.message = message; toast.type = type;
  setTimeout(() => { toast.show = false; }, 3000);
};

// ─── Form data ──────────────────────────────────────────────────
const general = reactive({
  maintenanceMode: false,
  showPricePublic: true,
  allowReviews: true,
  liveChat: true,
  siteName: 'Hệ thống OneHoreca',
  hotline: '0786.667.447',
  timezone: 'Asia/Ho_Chi_Minh',
  currency: 'VND',
  address: 'Số 15 Ngõ 495 Bạch Đằng, P. Hồng Hà, Hà Nội',
  contactEmail: 'horeca.fnb@gmail.com',
});

const branding = reactive({
  primaryColor: '#5b8e1d',
  secondaryColor: '#4A3018',
  tagline: 'Đối tác F&B tin cậy cho hệ thống khách sạn & nhà hàng',
  copyright: '© 2026 HORECA VN — Công ty CP SX & TM Horeca Việt Nam.',
});

const seo = reactive({
  metaTitle: 'OneHoreca — Thiết bị & Nguyên liệu F&B',
  metaDesc: 'Cung cấp sản phẩm, nguyên liệu và thiết bị F&B chất lượng cao cho hệ thống khách sạn 3–5 sao, resort và nhà hàng toàn quốc.',
  keywords: 'horeca, thiết bị fnb, sứ long phương, nguyên liệu pha chế',
  ga4Id: '',
  gtmId: '',
  gscToken: '',
  fbPixelId: '',
});

const security = reactive({
  twoFactor: false,
  lockOnFail: true,
  ipVnOnly: false,
  activityLog: true,
  sessionTimeout: 60,
  maxLoginAttempts: 5,
  minPasswordLength: 8,
});

const email = reactive({
  smtpHost: 'smtp.gmail.com',
  smtpPort: '587',
  smtpUser: 'horeca.fnb@gmail.com',
  smtpPass: '',
  fromEmail: 'no-reply@onehoreca.vn',
  fromName: 'OneHoreca System',
  testTo: '',
  smsProvider: 'esms',
  smsApiKey: '',
  smsBrandname: 'ONEHORECA',
});

const showSmtpPass = ref(false);
const testingEmail = ref(false);
const emailTestResult = ref(null);
const smsProviders = [
  { id: 'esms', label: 'eSMS' },
  { id: 'vietguys', label: 'Vietguys' },
  { id: 'speedsms', label: 'SpeedSMS' },
];

const testEmail = async () => {
  testingEmail.value = true;
  emailTestResult.value = null;
  // TODO: gọi API test email
  await new Promise(r => setTimeout(r, 1500));
  emailTestResult.value = {
    type: 'success',
    message: `Gửi thành công tới ${email.testTo || 'email test'}! Kiểm tra hộp thư.`
  };
  testingEmail.value = false;
};

const payment = reactive({
  gateways: [
    {
      id: 'bank', name: 'Chuyển khoản ngân hàng', desc: 'Vietcombank, Techcombank, MB Bank...',
      icon: 'building-bank', bgColor: '#e8f5e9', iconColor: '#2e7d32',
      enabled: true, hasConfig: false, fields: [], config: {}
    },
    {
      id: 'vnpay', name: 'VNPay', desc: 'Thanh toán qua cổng VNPay QR & thẻ ATM',
      icon: 'qr-code', bgColor: '#e3f2fd', iconColor: '#1565c0',
      enabled: true, hasConfig: true, fields: ['merchantId', 'secretKey'],
      config: { merchantId: '', secretKey: '', env: 'sandbox' }
    },
    {
      id: 'momo', name: 'MoMo', desc: 'Ví điện tử MoMo',
      icon: 'wallet2', bgColor: '#fce4ec', iconColor: '#ad1457',
      enabled: false, hasConfig: true, fields: ['partnerCode', 'accessKey'],
      config: { partnerCode: '', accessKey: '', env: 'sandbox' }
    },
    {
      id: 'zalopay', name: 'ZaloPay', desc: 'Thanh toán qua ZaloPay',
      icon: 'phone', bgColor: '#e3f2fd', iconColor: '#0068ff',
      enabled: false, hasConfig: true, fields: ['merchantId', 'secretKey'],
      config: { merchantId: '', secretKey: '', env: 'sandbox' }
    },
    {
      id: 'cod', name: 'COD — Thu tiền khi giao', desc: 'Người mua trả tiền mặt cho shipper',
      icon: 'cash-stack', bgColor: '#fff8e1', iconColor: '#e65100',
      enabled: true, hasConfig: false, fields: [], config: {}
    },
  ]
});

const shipping = reactive({
  carriers: [
    {
      id: 'ghn', name: 'GHN — Giao Hàng Nhanh', desc: 'Tích hợp API tự động tra cứu phí ship',
      bgColor: '#fff3e0', iconColor: '#e65100',
      enabled: true, apiToken: '', shopId: ''
    },
    {
      id: 'ghtk', name: 'GHTK — Giao Hàng Tiết Kiệm', desc: 'Giao hàng toàn quốc, giá thấp',
      bgColor: '#e8f5e9', iconColor: '#2e7d32',
      enabled: false, apiToken: '', shopId: ''
    },
    {
      id: 'vnpost', name: 'Vietnam Post', desc: 'Bưu điện Việt Nam — phủ sóng vùng sâu',
      bgColor: '#e3f2fd', iconColor: '#1565c0',
      enabled: false, apiToken: '', shopId: ''
    },
  ],
  freeShipping: true,
  freeShippingMin: 500000,
  freeShippingZone: 'all',
});

const notifications = reactive({
  customer: [
    { id: 'order_placed',    label: 'Đặt hàng thành công',    desc: 'Gửi xác nhận khi khách đặt đơn',         email: true,  sms: true },
    { id: 'order_confirmed', label: 'Đơn hàng được xác nhận', desc: 'Admin đã duyệt và xử lý đơn',            email: true,  sms: false },
    { id: 'order_shipped',   label: 'Đang giao hàng',         desc: 'Đơn đã chuyển cho đơn vị vận chuyển',   email: true,  sms: true },
    { id: 'order_delivered', label: 'Giao hàng thành công',   desc: 'Đơn đã được giao đến khách',             email: true,  sms: false },
    { id: 'order_cancelled', label: 'Đơn hàng bị huỷ',        desc: 'Thông báo khi đơn bị huỷ bởi bất kỳ bên', email: true, sms: true },
    { id: 'password_reset',  label: 'Đặt lại mật khẩu',       desc: 'Gửi link reset password',                email: true,  sms: false },
  ],
  admin: [
    { id: 'new_order',       label: 'Có đơn hàng mới',        desc: 'Thông báo mỗi khi có đơn đặt mới',      email: true,  push: true },
    { id: 'low_stock',       label: 'Tồn kho thấp',           desc: 'Sản phẩm sắp hết hàng',                  email: true,  push: true },
    { id: 'new_review',      label: 'Đánh giá mới',           desc: 'Khách hàng vừa gửi review',              email: false, push: true },
    { id: 'new_contact',     label: 'Có liên hệ mới',         desc: 'Form liên hệ vừa được gửi',              email: true,  push: false },
  ],
});

const backingUp = ref(false);
const backup = reactive({
  autoDailyBackup: true,
  backupToDrive: false,
  retentionDays: 30,
  scheduleTime: '02:00',
  files: [
    { name: 'backup_2026-05-07_02-00.sql.gz', date: '07/05/2026 02:00', size: '42.3 MB', status: 'success', statusLabel: 'Thành công' },
    { name: 'backup_2026-05-06_02-00.sql.gz', date: '06/05/2026 02:00', size: '41.8 MB', status: 'success', statusLabel: 'Thành công' },
    { name: 'backup_2026-05-05_02-00.sql.gz', date: '05/05/2026 02:00', size: '41.5 MB', status: 'success', statusLabel: 'Thành công' },
    { name: 'backup_2026-05-04_02-00.sql.gz', date: '04/05/2026 02:00', size: '40.9 MB', status: 'warning', statusLabel: 'Cảnh báo' },
  ]
});

const triggerBackup = async () => {
  backingUp.value = true;
  // TODO: gọi API trigger backup
  await new Promise(r => setTimeout(r, 2000));
  backup.files.unshift({
    name: `backup_${new Date().toISOString().slice(0,10)}_manual.sql.gz`,
    date: new Date().toLocaleString('vi-VN'),
    size: '42.5 MB',
    status: 'success',
    statusLabel: 'Thành công'
  });
  backingUp.value = false;
  showToast('Backup hoàn tất!');
};

const deleteBackup = (file) => {
  const idx = backup.files.indexOf(file);
  if (idx > -1) backup.files.splice(idx, 1);
  showToast('Đã xoá file backup.');
};

const handleUpload = (type, event) => {
  // TODO: gọi API upload
  const file = event.target.files[0];
  if (file) showToast(`Đã chọn ${file.name} — nhấn Lưu để cập nhật.`, 'info');
};

// ─── Save / Reset ────────────────────────────────────────────────
const saveSettings = (panel) => {
  // TODO: gọi axios.put('/api/v1/settings', payload)
  showToast('Cài đặt đã được lưu thành công!');
};

const resetForm = (panel) => {
  showToast('Đã hoàn tác về cài đặt trước đó.', 'info');
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700;900&display=swap');

.font-general { font-family: 'Quicksand', sans-serif !important; }

/* ══════════════════════════════════════════════════════════════
   PAGE HEADER
══════════════════════════════════════════════════════════════ */
.settings-page {
  padding: 1.5rem 1.75rem;
  min-height: 100vh;
  background: #f3f4f6;
}
.page-header {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 1.5rem;
}
.page-header-left { display: flex; align-items: center; gap: 16px; }
.page-header-icon {
  width: 48px; height: 48px; border-radius: 14px;
  background: linear-gradient(135deg, #5b8e1d, #3d6b10);
  display: flex; align-items: center; justify-content: center;
  font-size: 22px; color: #fff;
  box-shadow: 0 4px 16px rgba(91,142,29,.3);
}
.page-title { font-size: 20px; font-weight: 900; color: #1a202c; margin: 0; line-height: 1.2; }
.page-subtitle { font-size: 13px; color: #6b7280; margin: 0; margin-top: 2px; }
.system-status {
  display: flex; align-items: center; gap: 6px;
  font-size: 12.5px; font-weight: 600; color: #374151;
  background: #fff; border: 1px solid #e5e7eb;
  padding: 6px 14px; border-radius: 20px;
}
.status-dot {
  width: 8px; height: 8px; border-radius: 50%; background: #22c55e;
  animation: pulse-dot 2.5s infinite;
  flex-shrink: 0;
}
@keyframes pulse-dot {
  0%,100% { box-shadow: 0 0 0 0 rgba(34,197,94,.5); }
  50% { box-shadow: 0 0 0 6px rgba(34,197,94,0); }
}

/* ══════════════════════════════════════════════════════════════
   LAYOUT
══════════════════════════════════════════════════════════════ */
.settings-layout {
  display: flex; gap: 1.25rem; align-items: flex-start;
}
.settings-sidebar {
  width: 240px; flex-shrink: 0;
  background: #fff;
  border-radius: 16px;
  border: 1px solid #e5e7eb;
  padding: 1rem 0.75rem;
  position: sticky; top: 80px;
}
.settings-content {
  flex: 1; min-width: 0;
}

/* ══════════════════════════════════════════════════════════════
   SIDEBAR NAV
══════════════════════════════════════════════════════════════ */
.nav-group { margin-bottom: 0.25rem; }
.nav-group-label {
  font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 1.5px;
  color: #9ca3af; padding: 12px 10px 6px; margin-bottom: 2px;
}
.nav-group:first-child .nav-group-label { padding-top: 4px; }

.nav-item {
  display: flex; align-items: center; gap: 10px;
  width: 100%; padding: 9px 10px;
  border: none; background: transparent;
  border-radius: 10px; cursor: pointer;
  font-size: 13.5px; font-weight: 600; color: #374151;
  text-align: left;
  transition: background .15s, color .15s, transform .15s;
  position: relative;
}
.nav-item:hover { background: #f3f4f6; color: #1a202c; transform: translateX(2px); }
.nav-item.active {
  background: #f0f9e6;
  color: #3d7317;
  font-weight: 700;
}
.nav-item-icon {
  width: 30px; height: 30px; border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  font-size: 14px; flex-shrink: 0; transition: transform .15s;
}
.nav-item:hover .nav-item-icon,
.nav-item.active .nav-item-icon { transform: scale(1.1); }
.nav-icon--blue   { background: #dbeafe; color: #2563eb; }
.nav-icon--purple { background: #ede9fe; color: #7c3aed; }
.nav-icon--teal   { background: #ccfbf1; color: #0d9488; }
.nav-icon--red    { background: #fee2e2; color: #dc2626; }
.nav-icon--amber  { background: #fef3c7; color: #d97706; }
.nav-icon--green  { background: #dcfce7; color: #16a34a; }
.nav-icon--orange { background: #ffedd5; color: #ea580c; }
.nav-icon--gray   { background: #f1f5f9; color: #64748b; }
.nav-item.active .nav-icon--blue,
.nav-item.active .nav-icon--purple,
.nav-item.active .nav-icon--teal,
.nav-item.active .nav-icon--red,
.nav-item.active .nav-icon--amber,
.nav-item.active .nav-icon--orange,
.nav-item.active .nav-icon--gray { background: #dcfce7; color: #16a34a; }

.nav-item-label { flex: 1; min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.nav-item-badge {
  font-size: 10px; font-weight: 800; padding: 1px 6px;
  border-radius: 20px; flex-shrink: 0;
}
.badge--amber { background: #fef3c7; color: #b45309; }
.badge--red   { background: #fee2e2; color: #dc2626; }
.nav-item-arrow {
  font-size: 14px; color: #d1d5db; flex-shrink: 0;
  transition: color .15s, transform .15s;
}
.nav-item.active .nav-item-arrow { color: #5b8e1d; transform: translateX(2px); }

/* ══════════════════════════════════════════════════════════════
   PANEL
══════════════════════════════════════════════════════════════ */
.panel {
  background: #fff;
  border-radius: 16px;
  border: 1px solid #e5e7eb;
  overflow: hidden;
}
.panel-header {
  padding: 1.5rem 1.75rem 0;
  border-bottom: 1px solid #f3f4f6;
  padding-bottom: 1rem;
  margin-bottom: 1.5rem;
  display: flex; justify-content: space-between; align-items: flex-start;
}
.panel-title {
  font-size: 16px; font-weight: 900; color: #1a202c; margin: 0;
}
.panel-desc { font-size: 13px; color: #6b7280; margin: 4px 0 0; }

/* Alert banner */
.alert-banner {
  display: flex; align-items: center;
  padding: 12px 1.75rem; font-size: 13.5px; font-weight: 600;
  margin: 0 0 1rem;
}
.alert-warning { background: #fff7ed; color: #9a3412; border-bottom: 1px solid #fed7aa; }

/* ══════════════════════════════════════════════════════════════
   TOGGLE CARDS
══════════════════════════════════════════════════════════════ */
.toggle-card-grid {
  display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 10px; padding: 0 1.75rem; margin-bottom: 1.5rem;
}
.toggle-card {
  display: flex; align-items: center; gap: 12px;
  padding: 14px 16px;
  background: #fafafa; border: 1px solid #e5e7eb;
  border-radius: 12px;
  transition: background .15s, border-color .15s;
}
.toggle-card:hover { background: #f9fafb; border-color: #d1d5db; }
.toggle-card-icon {
  width: 38px; height: 38px; border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  font-size: 17px; flex-shrink: 0;
}
.toggle-card-icon--orange { background: #fff7ed; color: #ea580c; }
.toggle-card-icon--blue   { background: #dbeafe; color: #2563eb; }
.toggle-card-icon--green  { background: #dcfce7; color: #16a34a; }
.toggle-card-icon--purple { background: #ede9fe; color: #7c3aed; }
.toggle-card-icon--red    { background: #fee2e2; color: #dc2626; }
.toggle-card-icon--amber  { background: #fef3c7; color: #d97706; }
.toggle-card-body { flex: 1; min-width: 0; }
.toggle-card-title { font-size: 13.5px; font-weight: 700; color: #1a202c; }
.toggle-card-desc  { font-size: 12px; color: #6b7280; margin-top: 2px; }

/* ══════════════════════════════════════════════════════════════
   TOGGLE SWITCH
══════════════════════════════════════════════════════════════ */
.switch { position: relative; width: 44px; height: 24px; flex-shrink: 0; display: inline-block; }
.switch input { opacity: 0; width: 0; height: 0; position: absolute; }
.switch-slider {
  position: absolute; inset: 0;
  background: #d1d5db; border-radius: 24px; cursor: pointer;
  transition: .25s;
}
.switch-slider::before {
  content: ''; position: absolute;
  width: 18px; height: 18px; left: 3px; top: 3px;
  background: #fff; border-radius: 50%; transition: .25s;
  box-shadow: 0 1px 4px rgba(0,0,0,.15);
}
.switch input:checked + .switch-slider { background: #5b8e1d; }
.switch input:checked + .switch-slider::before { transform: translateX(20px); }

/* ══════════════════════════════════════════════════════════════
   FORM ELEMENTS
══════════════════════════════════════════════════════════════ */
.form-section { padding: 0 1.75rem 1.25rem; }
.form-section-title {
  font-size: 12px; font-weight: 900; text-transform: uppercase;
  letter-spacing: 1.2px; color: #9ca3af;
  padding: 0 0 0.75rem; margin-bottom: 1rem;
  border-bottom: 1px solid #f3f4f6;
}
.form-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
.form-group { margin-bottom: 1rem; }
.form-label {
  display: flex; align-items: center; justify-content: space-between;
  font-size: 13px; font-weight: 700; color: #374151;
  margin-bottom: 6px;
}
.required { color: #ef4444; }
.char-count { font-size: 11.5px; font-weight: 600; color: #9ca3af; }
.char-warn  { color: #ef4444; }

.form-input {
  width: 100%; padding: 9px 13px;
  font-size: 14px; font-family: 'Quicksand', sans-serif;
  border: 1px solid #e5e7eb; border-radius: 10px;
  background: #fafafa; color: #1a202c;
  outline: none; transition: border .15s, background .15s, box-shadow .15s;
}
.form-input:focus {
  border-color: #5b8e1d; background: #fff;
  box-shadow: 0 0 0 3px rgba(91,142,29,.1);
}
.form-select {
  width: 100%; padding: 9px 13px;
  font-size: 14px; font-family: 'Quicksand', sans-serif;
  border: 1px solid #e5e7eb; border-radius: 10px;
  background: #fafafa; color: #1a202c;
  outline: none; cursor: pointer; transition: border .15s;
}
.form-select:focus { border-color: #5b8e1d; }
textarea.form-input { resize: vertical; }

.input-prefix-wrap { position: relative; }
.input-prefix {
  position: absolute; left: 12px; top: 50%; transform: translateY(-50%);
  color: #9ca3af; font-size: 15px; pointer-events: none;
  display: flex; align-items: center;
}
.form-input.has-prefix { padding-left: 38px; }

.input-suffix-wrap { position: relative; }
.form-input.has-suffix { padding-right: 40px; }
.input-suffix-btn {
  position: absolute; right: 10px; top: 50%; transform: translateY(-50%);
  border: none; background: transparent; cursor: pointer;
  color: #9ca3af; font-size: 15px; padding: 0;
  transition: color .15s;
}
.input-suffix-btn:hover { color: #374151; }

.color-input-wrap { display: flex; align-items: center; gap: 8px; }
.color-picker {
  width: 44px; height: 38px; border: 1px solid #e5e7eb;
  border-radius: 10px; cursor: pointer; padding: 3px; flex-shrink: 0;
}
.color-preview {
  height: 6px; border-radius: 10px; margin-top: 6px;
  transition: background .2s;
}

/* Upload */
.upload-row { display: grid; grid-template-columns: repeat(3,1fr); gap: 1rem; }
.upload-box {
  display: flex; flex-direction: column; gap: 10px;
  padding: 16px; border: 1.5px dashed #e5e7eb;
  border-radius: 12px; transition: border-color .15s;
}
.upload-box:hover { border-color: #5b8e1d; }
.upload-preview {
  width: 100%; height: 80px;
  background: #f3f4f6; border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
}
.upload-preview--small { height: 50px; }
.upload-label { font-size: 13.5px; font-weight: 700; color: #1a202c; }
.upload-hint { font-size: 11.5px; color: #9ca3af; margin: 2px 0; }
.upload-btn {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 6px 12px; font-size: 12.5px; font-weight: 700;
  color: #3d7317; background: #f0f9e6;
  border: 1px solid #c6e89b; border-radius: 20px; cursor: pointer;
  transition: background .15s;
}
.upload-btn:hover { background: #e2f5c5; }

/* Test connection row */
.test-connection-row {
  display: flex; gap: 10px; margin-top: 1rem; align-items: center;
}
.test-result {
  display: flex; align-items: center; padding: 10px 14px;
  border-radius: 10px; font-size: 13.5px; font-weight: 600;
  margin-top: 8px;
}
.test-result--success { background: #f0f9e6; color: #3d7317; border: 1px solid #c6e89b; }
.test-result--error   { background: #fff1f2; color: #be123c; border: 1px solid #fda4af; }

/* Provider tabs */
.provider-tabs { display: flex; gap: 6px; flex-wrap: wrap; }
.provider-tab {
  padding: 6px 14px; border-radius: 20px; font-size: 13px; font-weight: 700;
  border: 1px solid #e5e7eb; background: transparent; color: #6b7280; cursor: pointer;
  transition: all .15s;
}
.provider-tab:hover { background: #f3f4f6; color: #1a202c; }
.provider-tab.active { background: #5b8e1d; color: #fff; border-color: #5b8e1d; }

/* Payment cards */
.payment-card-list { display: flex; flex-direction: column; gap: 8px; padding: 0 1.75rem; margin-bottom: 1.5rem; }
.payment-card {
  border: 1px solid #e5e7eb; border-radius: 12px;
  overflow: hidden; transition: border-color .15s;
}
.payment-card--active { border-color: #c6e89b; }
.payment-card-top {
  display: flex; align-items: center; gap: 14px;
  padding: 14px 16px;
}
.payment-card-icon {
  width: 42px; height: 42px; border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  font-size: 20px; flex-shrink: 0;
}
.payment-card-name { font-size: 14px; font-weight: 700; color: #1a202c; }
.payment-card-desc { font-size: 12.5px; color: #6b7280; margin-top: 2px; }
.payment-card-config {
  padding: 12px 16px 14px;
  background: #fafafa; border-top: 1px solid #f3f4f6;
}

/* Notifications */
.notif-section { margin-bottom: 1.5rem; padding: 0 1.75rem; }
.notif-section-title {
  font-size: 13px; font-weight: 800; color: #374151;
  padding: 0.6rem 1rem; background: #f3f4f6; border-radius: 10px;
  margin-bottom: 0.5rem;
}
.notif-row {
  display: flex; align-items: center; justify-content: space-between;
  padding: 12px 4px;
  border-bottom: 1px solid #f3f4f6;
}
.notif-row:last-child { border-bottom: none; }
.notif-label { font-size: 13.5px; font-weight: 700; color: #1a202c; }
.notif-desc  { font-size: 12px; color: #6b7280; margin-top: 2px; }
.notif-channels { display: flex; gap: 6px; flex-shrink: 0; }
.channel-toggle {
  display: flex; align-items: center; gap: 5px;
  padding: 5px 12px; border-radius: 20px; cursor: pointer;
  font-size: 12px; font-weight: 700;
  border: 1px solid #e5e7eb; color: #9ca3af;
  transition: all .15s; user-select: none;
}
.channel-toggle input { display: none; }
.channel-toggle.active { background: #f0f9e6; color: #3d7317; border-color: #c6e89b; }

/* Backup list */
.backup-list { display: flex; flex-direction: column; gap: 6px; }
.backup-item {
  display: flex; align-items: center; gap: 12px;
  padding: 12px 14px;
  background: #fafafa; border: 1px solid #e5e7eb;
  border-radius: 10px;
}
.backup-item-icon { font-size: 20px; color: #6b7280; flex-shrink: 0; }
.backup-item-name { font-size: 13px; font-weight: 700; color: #1a202c; font-family: monospace; }
.backup-item-meta { font-size: 12px; color: #9ca3af; margin-top: 2px; }
.backup-item-info { flex: 1; min-width: 0; }
.backup-item-status {
  font-size: 11px; font-weight: 800; padding: 2px 8px; border-radius: 20px; flex-shrink: 0;
}
.backup-status--success { background: #f0f9e6; color: #3d7317; }
.backup-status--warning { background: #fef3c7; color: #b45309; }
.backup-item-btn {
  width: 32px; height: 32px; border-radius: 8px; border: 1px solid #e5e7eb;
  background: #fff; cursor: pointer; display: flex; align-items: center;
  justify-content: center; font-size: 14px; color: #6b7280; flex-shrink: 0;
  transition: background .15s, color .15s;
}
.backup-item-btn:hover { background: #f3f4f6; color: #1a202c; }
.backup-item-btn--danger:hover { background: #fee2e2; color: #dc2626; border-color: #fca5a5; }

/* ══════════════════════════════════════════════════════════════
   PANEL FOOTER / BUTTONS
══════════════════════════════════════════════════════════════ */
.panel-footer {
  display: flex; align-items: center; justify-content: flex-end;
  gap: 10px; padding: 1rem 1.75rem;
  border-top: 1px solid #f3f4f6;
  background: #fafafa;
}
.btn-primary {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 9px 22px; background: #5b8e1d; color: #fff;
  border: none; border-radius: 20px;
  font-size: 13.5px; font-weight: 800; font-family: 'Quicksand', sans-serif;
  cursor: pointer; transition: background .15s, transform .12s, box-shadow .15s;
}
.btn-primary:hover { background: #3d7317; transform: translateY(-1px); box-shadow: 0 4px 14px rgba(91,142,29,.3); }
.btn-primary:active { transform: scale(0.97); }

.btn-secondary {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 9px 18px; background: transparent; color: #6b7280;
  border: 1px solid #e5e7eb; border-radius: 20px;
  font-size: 13.5px; font-weight: 700; font-family: 'Quicksand', sans-serif;
  cursor: pointer; transition: background .15s, color .15s;
}
.btn-secondary:hover { background: #f3f4f6; color: #1a202c; }

.btn-outline {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 9px 18px; background: transparent; color: #3d7317;
  border: 1px solid #c6e89b; border-radius: 20px;
  font-size: 13.5px; font-weight: 700; font-family: 'Quicksand', sans-serif;
  cursor: pointer; transition: background .15s;
}
.btn-outline:hover { background: #f0f9e6; }
.btn-outline:disabled { opacity: 0.5; cursor: not-allowed; }

/* ══════════════════════════════════════════════════════════════
   TOAST
══════════════════════════════════════════════════════════════ */
.toast-msg {
  position: fixed; bottom: 28px; right: 28px; z-index: 9999;
  display: flex; align-items: center;
  padding: 12px 20px; border-radius: 12px;
  font-size: 14px; font-weight: 700;
  box-shadow: 0 8px 32px rgba(0,0,0,.14);
}
.toast-msg--success { background: #1a2a0f; color: #a3e635; }
.toast-msg--info    { background: #1e3a5f; color: #93c5fd; }
.toast-msg--error   { background: #3b0000; color: #fca5a5; }
.toast-enter-active, .toast-leave-active { transition: all .3s cubic-bezier(.175,.885,.32,1.275); }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(20px) scale(0.95); }

/* ══════════════════════════════════════════════════════════════
   RESPONSIVE
══════════════════════════════════════════════════════════════ */
@media (max-width: 992px) {
  .settings-layout { flex-direction: column; }
  .settings-sidebar { width: 100%; position: static; }
  .nav-group { display: flex; flex-wrap: wrap; gap: 4px; }
  .nav-group-label { display: none; }
  .nav-item { width: auto; padding: 7px 12px; }
  .nav-item-label { display: none; }
  .nav-item-arrow { display: none; }
  .form-row-2 { grid-template-columns: 1fr; }
  .toggle-card-grid { grid-template-columns: 1fr; }
  .upload-row { grid-template-columns: 1fr; }
}
@media (max-width: 576px) {
  .settings-page { padding: 1rem; }
  .page-title { font-size: 17px; }
  .panel-header { padding: 1rem; }
  .form-section { padding: 0 1rem 1rem; }
  .panel-footer { padding: 1rem; }
  .payment-card-list { padding: 0 1rem; }
}
</style>
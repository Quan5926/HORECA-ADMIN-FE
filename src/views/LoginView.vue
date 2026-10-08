<template>
  <div class="auth-page-wrapper">

    <!-- Toast -->
    <div class="toast-container position-fixed top-0 end-0 p-3" style="z-index: 9999">
      <transition-group name="toast-fade">
        <div v-for="toast in toasts" :key="toast.id" class="custom-toast d-flex align-items-start" :class="toast.type">
          <div class="toast-icon-wrap me-3">
            <i v-if="toast.type === 'success'" class="bi bi-check-circle-fill"></i>
            <i v-else class="bi bi-exclamation-circle-fill"></i>
          </div>
          <div class="flex-grow-1">
            <div class="toast-title">{{ toast.title }}</div>
            <div class="toast-msg">{{ toast.message }}</div>
          </div>
          <div class="toast-bar"></div>
        </div>
      </transition-group>
    </div>

    <div class="auth-bg-section">
      <div class="container">
        <div class="auth-card mx-auto">
          <div class="row g-0">

            <!-- BRAND PANEL -->
            <div class="col-lg-5 brand-panel order-1 order-lg-2">
              <div class="brand-blob brand-blob--tl"></div>
              <div class="brand-blob brand-blob--br"></div>
              <div class="brand-inner d-flex flex-column h-100 p-4 p-md-5 position-relative">
                <div class="brand-logo mb-auto">
                  <div class="logo-mark">H</div>
                  <div>
                    <div class="brand-name">HORECA</div>
                    <div class="brand-sub">ADMIN SYSTEM</div>
                  </div>
                </div>
                <div class="brand-copy my-5">
                  <div class="brand-eyebrow mb-2">
                    <span class="eyebrow-dot"></span>
                    <span>{{ currentView === 'login' ? 'Quản trị viên' : currentView === 'register' ? 'Tạo tài khoản' : 'Hỗ trợ tài khoản' }}</span>
                  </div>
                  <h2 class="brand-tagline">
                    <template v-if="currentView === 'login'">Đăng nhập<br><em>quản trị</em></template>
                    <template v-else-if="currentView === 'register'">Đăng ký<br><em>Admin</em></template>
                    <template v-else>Khôi phục<br><em>tài khoản</em></template>
                  </h2>
                  <p class="brand-desc">
                    Hệ thống quản trị HORECA — quản lý đơn hàng, sản phẩm và khách hàng toàn diện.
                  </p>
                </div>
                <div class="brand-features">
                  <div class="feat-row">
                    <div class="feat-icon"><i class="bi bi-shield-fill-check"></i></div>
                    <div><div class="feat-title">Bảo mật cao</div><div class="feat-sub">Xác thực 2 lớp & JWT</div></div>
                  </div>
                  <div class="feat-row">
                    <div class="feat-icon"><i class="bi bi-graph-up-arrow"></i></div>
                    <div><div class="feat-title">Thống kê real-time</div><div class="feat-sub">Báo cáo doanh thu tức thì</div></div>
                  </div>
                  <div class="feat-row">
                    <div class="feat-icon"><i class="bi bi-people-fill"></i></div>
                    <div><div class="feat-title">Quản lý tập trung</div><div class="feat-sub">Toàn bộ hệ thống một nơi</div></div>
                  </div>
                </div>
                <div class="brand-footer mt-5">
                  <div class="brand-footer-line"></div>
                  <span class="brand-footer-text">© 2025 HORECA One Solution</span>
                </div>
              </div>
            </div>

            <!-- FORM PANEL -->
            <div class="col-lg-7 form-panel order-2 order-lg-1">
              <div class="form-inner p-4 p-md-5">
                <transition name="fade-slide" mode="out-in">

                  <!-- ========== LOGIN ========== -->
                  <div v-if="currentView === 'login'" key="login">
                    <div class="view-header mb-5">
                      <h3 class="view-title">Đăng nhập</h3>
                      <p class="view-sub">Chào mừng quay trở lại hệ thống quản trị HORECA!</p>
                    </div>

                    <form @submit.prevent="handleLogin">
                      <div class="field-group mb-4">
                        <label class="field-label">Email / Số điện thoại</label>
                        <div class="field-wrap">
                          <i class="bi bi-person-circle field-icon"></i>
                          <input v-model="loginForm.identifier" type="text" class="field-input" placeholder="Nhập tài khoản Admin">
                        </div>
                      </div>

                      <div class="field-group mb-2">
                        <label class="field-label">Mật khẩu</label>
                        <div class="field-wrap">
                          <i class="bi bi-lock-fill field-icon"></i>
                          <input v-model="loginForm.password" :type="showLoginPassword ? 'text' : 'password'" class="field-input pe-5" placeholder="••••••••">
                          <button type="button" class="eye-btn" @click="showLoginPassword = !showLoginPassword" tabindex="-1">
                            <i class="bi" :class="showLoginPassword ? 'bi-eye-slash' : 'bi-eye'"></i>
                          </button>
                        </div>
                      </div>

                      <div class="mb-4 text-end">
                        <button @click="switchView('forgot')" type="button" class="link-red small">
                          <i class="bi bi-question-circle me-1"></i>Quên mật khẩu?
                        </button>
                      </div>

                      <div class="mb-4 d-flex justify-content-center">
                        <VueRecaptcha ref="recaptcha" sitekey="6Ld2GZosAAAAAO_dH-9M0nX4kkSagCeHDm8RzVvX"
                          @verify="recaptchaVerified" @expire="recaptchaExpired" @fail="recaptchaFailed" />
                      </div>

                      <div v-if="errorMessage" class="error-banner mb-4">
                        <i class="bi bi-exclamation-triangle-fill me-2"></i>{{ errorMessage }}
                      </div>

                      <button type="submit" class="btn-primary w-100 mb-4" :disabled="isLoading">
                        <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
                        <i v-else class="bi bi-box-arrow-in-right me-2"></i>
                        {{ isLoading ? 'Đang xử lý...' : 'Đăng nhập' }}
                      </button>

                      <p class="text-center switch-text">
                        Chưa có tài khoản Admin?
                        <button @click="switchView('register')" type="button" class="link-red fw-bold ms-1">Đăng ký ngay</button>
                      </p>
                    </form>
                  </div>

                  <!-- ========== REGISTER ========== -->
                  <div v-else-if="currentView === 'register'" key="register">
                    <div class="view-header mb-5">
                      <h3 class="view-title">{{ otpSent ? 'Xác thực OTP' : 'Đăng ký Admin' }}</h3>
                      <p class="view-sub">{{ otpSent ? 'Nhập mã OTP đã được gửi đến email của bạn.' : 'Tạo tài khoản quản trị viên HORECA.' }}</p>
                    </div>

                    <form @submit.prevent="otpSent ? handleVerifyRegisterOtp() : handleRequestRegister()">
                      <template v-if="!otpSent">
                        <div class="row g-3 mb-3">
                          <div class="col-md-6">
                            <div class="field-group">
                              <label class="field-label">Họ &amp; Tên</label>
                              <div class="field-wrap">
                                <i class="bi bi-person-vcard field-icon"></i>
                                <input v-model="registerForm.fullname" type="text" class="field-input"
                                       :class="{'is-invalid': errors.fullname}" placeholder="Họ tên đầy đủ">
                              </div>
                              <div v-if="errors.fullname" class="field-error">{{ errors.fullname }}</div>
                            </div>
                          </div>
                          <div class="col-md-6">
                            <div class="field-group">
                              <label class="field-label">Số điện thoại <span class="optional-tag">(Tùy chọn)</span></label>
                              <div class="field-wrap">
                                <i class="bi bi-telephone-fill field-icon"></i>
                                <input v-model="registerForm.phone" type="tel" class="field-input"
                                       :class="{'is-invalid': errors.phone}" placeholder="0xxx xxx xxx">
                              </div>
                              <div v-if="errors.phone" class="field-error">{{ errors.phone }}</div>
                            </div>
                          </div>
                        </div>

                        <div class="field-group mb-3">
                          <label class="field-label">Email</label>
                          <div class="field-wrap">
                            <i class="bi bi-envelope-fill field-icon"></i>
                            <input v-model="registerForm.email" type="email" class="field-input"
                                   :class="{'is-invalid': errors.email}" placeholder="admin@horeca.com">
                          </div>
                          <div v-if="errors.email" class="field-error">{{ errors.email }}</div>
                        </div>

                        <!-- PASSWORD + CHECKER -->
                        <div class="field-group mb-3">
                          <label class="field-label">Mật khẩu</label>
                          <div class="field-wrap">
                            <i class="bi bi-lock-fill field-icon"></i>
                            <input v-model="registerForm.password" :type="showRegisterPassword ? 'text' : 'password'"
                                   class="field-input pe-5" :class="{'is-invalid': errors.password}"
                                   placeholder="Ít nhất 8 ký tự, có chữ, số, ký tự đặc biệt">
                            <button type="button" class="eye-btn" @click="showRegisterPassword = !showRegisterPassword" tabindex="-1">
                              <i class="bi" :class="showRegisterPassword ? 'bi-eye-slash' : 'bi-eye'"></i>
                            </button>
                          </div>
                          <div v-if="errors.password" class="field-error">{{ errors.password }}</div>

                          <!-- Password rules -->
                          <div class="pwd-rules mt-2" v-if="registerForm.password">
                            <div class="pwd-rule" :class="registerForm.password.length >= 8 ? 'rule--pass' : 'rule--fail'">
                              <i :class="registerForm.password.length >= 8 ? 'bi-check-circle-fill' : 'bi-x-circle-fill'" class="bi me-1"></i>Tối thiểu 8 ký tự
                            </div>
                            <div class="pwd-rule" :class="/[A-Z]/.test(registerForm.password) ? 'rule--pass' : 'rule--fail'">
                              <i :class="/[A-Z]/.test(registerForm.password) ? 'bi-check-circle-fill' : 'bi-x-circle-fill'" class="bi me-1"></i>Có ít nhất 1 chữ hoa (A-Z)
                            </div>
                            <div class="pwd-rule" :class="/[0-9]/.test(registerForm.password) ? 'rule--pass' : 'rule--fail'">
                              <i :class="/[0-9]/.test(registerForm.password) ? 'bi-check-circle-fill' : 'bi-x-circle-fill'" class="bi me-1"></i>Có ít nhất 1 chữ số (0-9)
                            </div>
                            <div class="pwd-rule" :class="/[^A-Za-z0-9]/.test(registerForm.password) ? 'rule--pass' : 'rule--fail'">
                              <i :class="/[^A-Za-z0-9]/.test(registerForm.password) ? 'bi-check-circle-fill' : 'bi-x-circle-fill'" class="bi me-1"></i>Có ít nhất 1 ký tự đặc biệt (!@#$...)
                            </div>
                          </div>
                        </div>

                        <!-- Strength bar -->
                        <div class="pwd-strength mb-4" v-if="registerForm.password">
                          <div class="strength-bars">
                            <div v-for="i in 4" :key="i" class="strength-bar"
                                 :class="{ active: pwdStrength >= i, ['lvl-'+pwdStrength]: pwdStrength >= i }"></div>
                          </div>
                          <span class="strength-label" :class="'lvl-'+pwdStrength">{{ pwdStrengthLabel }}</span>
                        </div>

                        <div class="mb-4 d-flex justify-content-center">
                          <VueRecaptcha ref="recaptcha" sitekey="6Ld2GZosAAAAAO_dH-9M0nX4kkSagCeHDm8RzVvX"
                            @verify="recaptchaVerified" @expire="recaptchaExpired" @fail="recaptchaFailed" />
                        </div>
                      </template>

                      <!-- OTP -->
                      <template v-else>
                        <div class="otp-info-box mb-4">
                          <div class="otp-info-icon"><i class="bi bi-envelope-check-fill"></i></div>
                          <div>
                            <div class="otp-info-title">Mã OTP đã được gửi đến</div>
                            <div class="otp-info-email">{{ registerForm.email }}</div>
                          </div>
                        </div>
                        <div class="field-group mb-2">
                          <label class="field-label">Nhập mã OTP (6 chữ số)</label>
                          <input v-model="otpCode" type="text" class="otp-input text-center"
                                 placeholder="• • • • • •" maxlength="6">
                        </div>
                        <div class="mb-4 text-end">
                          <small v-if="countdown > 0" class="text-muted">Gửi lại sau <strong class="text-red">{{ countdown }}s</strong></small>
                          <button v-else type="button" @click="handleRequestRegister" class="link-red small">
                            <i class="bi bi-arrow-clockwise me-1"></i>Gửi lại mã
                          </button>
                        </div>
                      </template>

                      <div v-if="errorMessage" class="error-banner mb-4">
                        <i class="bi bi-exclamation-triangle-fill me-2"></i>{{ errorMessage }}
                      </div>

                      <button type="submit" class="btn-primary w-100 mb-3" :disabled="isLoading">
                        <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
                        <i v-else class="bi me-2" :class="otpSent ? 'bi-check-circle-fill' : 'bi-send-fill'"></i>
                        {{ isLoading ? 'Đang xử lý...' : (otpSent ? 'Xác nhận & Đăng ký' : 'Gửi mã xác thực') }}
                      </button>

                      <button v-if="otpSent" @click="resetRegisterForm" type="button" class="btn-outline w-100 mb-3">
                        <i class="bi bi-arrow-left me-2"></i>Quay lại sửa thông tin
                      </button>
                      <p v-else class="text-center switch-text">
                        Đã có tài khoản?
                        <button @click="switchView('login')" type="button" class="link-red fw-bold ms-1">Đăng nhập</button>
                      </p>
                    </form>
                  </div>

                  <!-- ========== FORGOT PASSWORD ========== -->
                  <div v-else-if="currentView === 'forgot'" key="forgot">
                    <div class="view-header mb-5">
                      <h3 class="view-title">
                        {{ forgotStep === 'email' ? 'Quên mật khẩu' : forgotStep === 'otp' ? 'Xác thực OTP' : 'Mật khẩu mới' }}
                      </h3>
                      <p class="view-sub">
                        <span v-if="forgotStep === 'email'">Nhập email đã đăng ký để nhận mã xác thực.</span>
                        <span v-else-if="forgotStep === 'otp'">Mã OTP đã được gửi đến <strong>{{ forgotEmail }}</strong></span>
                        <span v-else>Tạo mật khẩu mới cho tài khoản của bạn.</span>
                      </p>
                    </div>

                    <!-- Step indicator -->
                    <div class="step-track mb-5">
                      <div v-for="(s, i) in forgotSteps" :key="s.key" class="step-track-item">
                        <div class="step-node" :class="{ 'is-active': forgotStep === s.key, 'is-done': forgotStepIndex > i }">
                          <i v-if="forgotStepIndex > i" class="bi bi-check-lg"></i>
                          <span v-else>{{ i + 1 }}</span>
                        </div>
                        <div class="step-label">{{ s.label }}</div>
                        <div v-if="i < forgotSteps.length - 1" class="step-connector" :class="{ 'is-done': forgotStepIndex > i }"></div>
                      </div>
                    </div>

                    <!-- Step 1: Email -->
                    <form v-if="forgotStep === 'email'" @submit.prevent="handleForgotRequestOtp">
                      <div class="field-group mb-4">
                        <label class="field-label">Địa chỉ Email</label>
                        <div class="field-wrap">
                          <i class="bi bi-envelope-fill field-icon"></i>
                          <input v-model="forgotEmail" type="email" class="field-input" placeholder="Nhập email đã đăng ký" required>
                        </div>
                      </div>
                      <div class="mb-4 d-flex justify-content-center">
                        <VueRecaptcha ref="recaptcha" sitekey="6Ld2GZosAAAAAO_dH-9M0nX4kkSagCeHDm8RzVvX"
                          @verify="recaptchaVerified" @expire="recaptchaExpired" @fail="recaptchaFailed" />
                      </div>
                      <div v-if="errorMessage" class="error-banner mb-4">
                        <i class="bi bi-exclamation-triangle-fill me-2"></i>{{ errorMessage }}
                      </div>
                      <button type="submit" class="btn-primary w-100 mb-3" :disabled="isLoading">
                        <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
                        <i v-else class="bi bi-send-fill me-2"></i>
                        {{ isLoading ? 'Đang gửi...' : 'Gửi mã OTP' }}
                      </button>
                      <div class="text-center">
                        <button @click="switchView('login')" type="button" class="link-muted">
                          <i class="bi bi-arrow-left me-1"></i>Quay lại đăng nhập
                        </button>
                      </div>
                    </form>

                    <!-- Step 2: OTP -->
                    <form v-else-if="forgotStep === 'otp'" @submit.prevent="handleForgotVerifyOtp">
                      <div class="otp-info-box mb-4">
                        <div class="otp-info-icon"><i class="bi bi-envelope-check-fill"></i></div>
                        <div>
                          <div class="otp-info-title">Kiểm tra hộp thư đến</div>
                          <div class="otp-info-email">{{ forgotEmail }}</div>
                        </div>
                      </div>
                      <div class="field-group mb-2">
                        <label class="field-label">Nhập mã OTP (6 chữ số)</label>
                        <input v-model="forgotOtpCode" type="text" class="otp-input text-center"
                               placeholder="• • • • • •" maxlength="6">
                      </div>
                      <div class="mb-4 text-end">
                        <small v-if="countdown > 0" class="text-muted">Gửi lại sau <strong class="text-red">{{ countdown }}s</strong></small>
                        <button v-else type="button" @click="handleForgotRequestOtp" class="link-red small">
                          <i class="bi bi-arrow-clockwise me-1"></i>Gửi lại mã
                        </button>
                      </div>
                      <div v-if="errorMessage" class="error-banner mb-4">
                        <i class="bi bi-exclamation-triangle-fill me-2"></i>{{ errorMessage }}
                      </div>
                      <button type="submit" class="btn-primary w-100 mb-3" :disabled="isLoading">
                        <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
                        <i v-else class="bi bi-shield-check-fill me-2"></i>
                        {{ isLoading ? 'Đang xác thực...' : 'Xác nhận OTP' }}
                      </button>
                      <div class="text-center">
                        <button @click="forgotStep = 'email'; errorMessage = ''" type="button" class="link-muted">
                          <i class="bi bi-arrow-left me-1"></i>Đổi email khác
                        </button>
                      </div>
                    </form>

                    <!-- Step 3: New password + checker -->
                    <form v-else-if="forgotStep === 'newpass'" @submit.prevent="handleForgotResetPassword">
                      <div class="field-group mb-3">
                        <label class="field-label">Mật khẩu mới</label>
                        <div class="field-wrap">
                          <i class="bi bi-lock-fill field-icon"></i>
                          <input v-model="newPassword" :type="showNewPassword ? 'text' : 'password'"
                                 class="field-input pe-5" placeholder="Ít nhất 8 ký tự, có chữ, số, ký tự đặc biệt">
                          <button type="button" class="eye-btn" @click="showNewPassword = !showNewPassword" tabindex="-1">
                            <i class="bi" :class="showNewPassword ? 'bi-eye-slash' : 'bi-eye'"></i>
                          </button>
                        </div>

                        <!-- Password rules -->
                        <div class="pwd-rules mt-2" v-if="newPassword">
                          <div class="pwd-rule" :class="newPassword.length >= 8 ? 'rule--pass' : 'rule--fail'">
                            <i :class="newPassword.length >= 8 ? 'bi-check-circle-fill' : 'bi-x-circle-fill'" class="bi me-1"></i>Tối thiểu 8 ký tự
                          </div>
                          <div class="pwd-rule" :class="/[A-Z]/.test(newPassword) ? 'rule--pass' : 'rule--fail'">
                            <i :class="/[A-Z]/.test(newPassword) ? 'bi-check-circle-fill' : 'bi-x-circle-fill'" class="bi me-1"></i>Có ít nhất 1 chữ hoa (A-Z)
                          </div>
                          <div class="pwd-rule" :class="/[0-9]/.test(newPassword) ? 'rule--pass' : 'rule--fail'">
                            <i :class="/[0-9]/.test(newPassword) ? 'bi-check-circle-fill' : 'bi-x-circle-fill'" class="bi me-1"></i>Có ít nhất 1 chữ số (0-9)
                          </div>
                          <div class="pwd-rule" :class="/[^A-Za-z0-9]/.test(newPassword) ? 'rule--pass' : 'rule--fail'">
                            <i :class="/[^A-Za-z0-9]/.test(newPassword) ? 'bi-check-circle-fill' : 'bi-x-circle-fill'" class="bi me-1"></i>Có ít nhất 1 ký tự đặc biệt (!@#$...)
                          </div>
                        </div>
                      </div>

                      <!-- Strength bar -->
                      <div class="pwd-strength mb-3" v-if="newPassword">
                        <div class="strength-bars">
                          <div v-for="i in 4" :key="i" class="strength-bar"
                               :class="{ active: newPwdStrength >= i, ['lvl-'+newPwdStrength]: newPwdStrength >= i }"></div>
                        </div>
                        <span class="strength-label" :class="'lvl-'+newPwdStrength">{{ newPwdStrengthLabel }}</span>
                      </div>

                      <div class="field-group mb-4">
                        <label class="field-label">Xác nhận mật khẩu</label>
                        <div class="field-wrap">
                          <i class="bi bi-lock-fill field-icon"></i>
                          <input v-model="confirmPassword" :type="showConfirmPassword ? 'text' : 'password'"
                                 class="field-input pe-5" placeholder="Nhập lại mật khẩu">
                          <button type="button" class="eye-btn" @click="showConfirmPassword = !showConfirmPassword" tabindex="-1">
                            <i class="bi" :class="showConfirmPassword ? 'bi-eye-slash' : 'bi-eye'"></i>
                          </button>
                        </div>
                        <div v-if="confirmPassword && newPassword !== confirmPassword" class="field-error mt-1">
                          <i class="bi bi-exclamation-circle me-1"></i>Mật khẩu không khớp
                        </div>
                        <div v-else-if="confirmPassword && newPassword === confirmPassword" class="field-success mt-1">
                          <i class="bi bi-check-circle me-1"></i>Mật khẩu khớp
                        </div>
                      </div>

                      <div v-if="errorMessage" class="error-banner mb-4">
                        <i class="bi bi-exclamation-triangle-fill me-2"></i>{{ errorMessage }}
                      </div>
                      <button type="submit" class="btn-primary w-100" :disabled="isLoading">
                        <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
                        <i v-else class="bi bi-check-circle-fill me-2"></i>
                        {{ isLoading ? 'Đang cập nhật...' : 'Đặt lại mật khẩu' }}
                      </button>
                    </form>
                  </div>

                </transition>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, nextTick, computed } from 'vue';
import { useRouter } from 'vue-router';
import authService from '@/services/authService';
import VueRecaptcha from 'vue3-recaptcha2';
import axios from 'axios';

const router = useRouter();

const currentView  = ref('login');
const isLoading    = ref(false);
const errorMessage = ref('');
const toasts       = ref([]);
const countdown    = ref(0);

const loginForm    = reactive({ identifier: '', password: '' });
const registerForm = reactive({ fullname: '', phone: '', email: '', password: '' });
const errors       = reactive({ fullname: '', email: '', phone: '', password: '' });

const showLoginPassword    = ref(false);
const showRegisterPassword = ref(false);
const showNewPassword      = ref(false);
const showConfirmPassword  = ref(false);

const otpSent = ref(false);
const otpCode = ref('');

const forgotSteps = [
  { key: 'email',   label: 'Nhập email' },
  { key: 'otp',     label: 'Xác thực OTP' },
  { key: 'newpass', label: 'Mật khẩu mới' },
];
const forgotStep      = ref('email');
const forgotEmail     = ref('');
const forgotOtpCode   = ref('');
const newPassword     = ref('');
const confirmPassword = ref('');
const forgotOtpToken  = ref('');
const forgotStepIndex = computed(() => forgotSteps.findIndex(s => s.key === forgotStep.value));

const recaptcha      = ref(null);
const recaptchaToken = ref('');

const recaptchaVerified = (r) => { recaptchaToken.value = r; errorMessage.value = ''; };
const recaptchaExpired  = ()  => { recaptchaToken.value = ''; };
const recaptchaFailed   = ()  => { errorMessage.value = 'Lỗi kết nối đến Google reCAPTCHA.'; };

const resetCaptcha = async () => {
  recaptchaToken.value = '';
  await nextTick();
  recaptcha.value?.reset();
};

// ── Password strength ──
const calcStrength = (pwd) => {
  if (!pwd) return 0;
  let s = 0;
  if (pwd.length >= 8)        s++;
  if (/[A-Z]/.test(pwd))      s++;
  if (/\d/.test(pwd))         s++;
  if (/[@$!%*#?&]/.test(pwd)) s++;
  return s;
};
const strengthLabels      = { 1: 'Yếu', 2: 'Trung bình', 3: 'Mạnh', 4: 'Rất mạnh' };
const pwdStrength         = computed(() => calcStrength(registerForm.password));
const pwdStrengthLabel    = computed(() => strengthLabels[pwdStrength.value] || '');
const newPwdStrength      = computed(() => calcStrength(newPassword.value));
const newPwdStrengthLabel = computed(() => strengthLabels[newPwdStrength.value] || '');

const pushToast = (title, message, type = 'success') => {
  const id = Date.now();
  toasts.value.push({ id, title, message, type });
  setTimeout(() => { toasts.value = toasts.value.filter(t => t.id !== id); }, 3500);
};

const startCountdown = (seconds = 300) => {
  countdown.value = seconds;
  const timer = setInterval(() => { if (--countdown.value <= 0) clearInterval(timer); }, 1000);
};

const switchView = async (view) => {
  currentView.value = view;
  otpSent.value = false; otpCode.value = ''; errorMessage.value = '';
  forgotStep.value = 'email'; forgotEmail.value = ''; forgotOtpCode.value = '';
  newPassword.value = ''; confirmPassword.value = '';
  await resetCaptcha();
};

const resetRegisterForm = () => {
  otpSent.value = false; otpCode.value = ''; errorMessage.value = '';
};

// ===================== LOGIN =====================
const handleLogin = async () => {
  errorMessage.value = '';
  if (!loginForm.identifier || !loginForm.password) {
    errorMessage.value = 'Vui lòng nhập đầy đủ thông tin!'; return;
  }
  if (!recaptchaToken.value) {
    errorMessage.value = 'Vui lòng tích "Tôi không phải người máy"!'; return;
  }
  isLoading.value = true;
  try {
    const { data } = await authService.adminLogin(loginForm.identifier, loginForm.password, recaptchaToken.value);
    const { token, username, role, id } = data;

    if (role === 'QUAN_TRI' || role === 'ROLE_QUAN_TRI') {
      sessionStorage.setItem('admin_token',   token);
sessionStorage.setItem('admin_name',    username);
sessionStorage.setItem('admin_role',    role);
sessionStorage.setItem('admin_is_auth', 'true');
if (id) sessionStorage.setItem('admin_userId', String(id));

      pushToast('Thành công', 'Chào mừng Quản trị viên!');
      setTimeout(() => { window.location.href = '/admin/'; }, 1500);
    } else {
  errorMessage.value = 'Tài khoản này không có quyền truy cập trang quản trị!';
  await resetCaptcha();
}
  } catch (err) {
    errorMessage.value = err.response?.data?.message || 'Đăng nhập thất bại!';
    await resetCaptcha();
  } finally {
    isLoading.value = false;
  }
};

// ===================== REGISTER =====================
const handleRequestRegister = async () => {
  errorMessage.value = '';
  if (!validateForm()) return;
  if (!recaptchaToken.value) {
    errorMessage.value = 'Vui lòng tích "Tôi không phải người máy"!'; return;
  }
  isLoading.value = true;
  try {
    await authService.requestOtp({
      email: registerForm.email.trim(),
      phone: registerForm.phone?.trim() || null,
      fullname: registerForm.fullname.trim(),
      password: registerForm.password,
      recaptchaToken: recaptchaToken.value
    });
    otpSent.value = true;
    startCountdown(300);
    pushToast('Đã gửi mã', 'Vui lòng kiểm tra email để lấy mã OTP.');
  } catch (err) {
    errorMessage.value = err.response?.data?.message || 'Không thể gửi mã OTP!';
    await resetCaptcha();
  } finally {
    isLoading.value = false;
  }
};

const handleVerifyRegisterOtp = async () => {
  if (!/^\d{6}$/.test(otpCode.value.trim())) {
    errorMessage.value = 'Mã OTP phải là 6 chữ số!'; return;
  }
  isLoading.value = true;
  try {
    await authService.verifyOtp({
      email: registerForm.email.trim(),
      phone: registerForm.phone?.trim() || null,
      fullname: registerForm.fullname.trim(),
      password: registerForm.password,
      otp: otpCode.value.trim()
    });
    pushToast('Tuyệt vời!', 'Tài khoản Admin đã được tạo thành công!');
    setTimeout(() => {
      switchView('login');
      loginForm.identifier = registerForm.email;
      Object.assign(registerForm, { fullname: '', phone: '', email: '', password: '' });
    }, 1500);
  } catch (err) {
    errorMessage.value = err.response?.data?.message || 'Mã OTP không đúng hoặc đã hết hạn!';
  } finally {
    isLoading.value = false;
  }
};

// ===================== FORGOT =====================
const handleForgotRequestOtp = async () => {
  errorMessage.value = '';
  if (!forgotEmail.value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(forgotEmail.value)) {
    errorMessage.value = 'Vui lòng nhập email hợp lệ!'; return;
  }
  if (!recaptchaToken.value) {
    errorMessage.value = 'Vui lòng tích "Tôi không phải người máy"!'; return;
  }
  isLoading.value = true;
  try {
    await authService.forgotPasswordRequestOtp({ email: forgotEmail.value.trim(), recaptchaToken: recaptchaToken.value });
    forgotStep.value = 'otp';
    startCountdown(300);
    pushToast('Đã gửi OTP', 'Vui lòng kiểm tra hộp thư của bạn.');
    await resetCaptcha();
  } catch (err) {
    errorMessage.value = err.response?.data?.message || 'Email không tồn tại trên hệ thống!';
    await resetCaptcha();
  } finally {
    isLoading.value = false;
  }
};

const handleForgotVerifyOtp = async () => {
  errorMessage.value = '';
  if (!/^\d{6}$/.test(forgotOtpCode.value.trim())) {
    errorMessage.value = 'Mã OTP phải là 6 chữ số!'; return;
  }
  isLoading.value = true;
  try {
    const { data } = await authService.forgotPasswordVerifyOtp({ email: forgotEmail.value.trim(), otp: forgotOtpCode.value.trim() });
    forgotOtpToken.value = data?.resetToken || '';
    forgotStep.value = 'newpass';
    pushToast('Xác thực thành công', 'Hãy tạo mật khẩu mới cho tài khoản.');
  } catch (err) {
    errorMessage.value = err.response?.data?.message || 'Mã OTP không đúng hoặc đã hết hạn!';
  } finally {
    isLoading.value = false;
  }
};

const handleForgotResetPassword = async () => {
  errorMessage.value = '';
  const PWD_RE = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
  if (!PWD_RE.test(newPassword.value)) {
    errorMessage.value = 'Mật khẩu tối thiểu 8 ký tự, gồm chữ, số và ký tự đặc biệt!'; return;
  }
  if (newPassword.value !== confirmPassword.value) {
    errorMessage.value = 'Mật khẩu xác nhận không khớp!'; return;
  }
  isLoading.value = true;
  try {
    await authService.forgotPasswordReset({
      email: forgotEmail.value.trim(),
      otp: forgotOtpCode.value.trim(),
      newPassword: newPassword.value,
      resetToken: forgotOtpToken.value
    });
    pushToast('Thành công!', 'Mật khẩu đã được cập nhật. Vui lòng đăng nhập lại.');
    setTimeout(() => { switchView('login'); }, 2000);
  } catch (err) {
    errorMessage.value = err.response?.data?.message || 'Không thể đặt lại mật khẩu, vui lòng thử lại!';
  } finally {
    isLoading.value = false;
  }
};

// ===================== VALIDATE =====================
const REGEX = {
  NAME:  /^[\p{L} ]{2,50}$/u,
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^(0|84)(3|5|7|8|9)([0-9]{8})$/,
  PWD:   /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
};
const validateForm = () => {
  let ok = true;
  errors.fullname = (!registerForm.fullname?.trim() || !REGEX.NAME.test(registerForm.fullname.trim()))
    ? (ok = false, 'Họ tên từ 2-50 ký tự, không chứa ký tự đặc biệt') : '';
  errors.email    = (!registerForm.email?.trim()    || !REGEX.EMAIL.test(registerForm.email))
    ? (ok = false, 'Email không đúng định dạng') : '';
  errors.phone    = (!registerForm.phone?.trim()    || !REGEX.PHONE.test(registerForm.phone))
    ? (ok = false, 'SĐT 10 số (đầu 03, 05, 07, 08, 09)') : '';
  errors.password = (!registerForm.password         || !REGEX.PWD.test(registerForm.password))
    ? (ok = false, 'Tối thiểu 8 ký tự, gồm chữ hoa, số và ký tự đặc biệt') : '';
  if (!ok) pushToast('Lỗi', 'Vui lòng kiểm tra lại thông tin!', 'error');
  return ok;
};
</script>

<style scoped>
.auth-page-wrapper {
  --red:      #C8102E;
  --red-dark: #8b0d1f;
  --red-deep: #5a0912;
  --white:    #ffffff;
  --gray-200: #e5e7eb;
  --gray-400: #9ca3af;
  --gray-600: #6b7280;
  --gray-900: #111827;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  min-height: 100vh;
  background: #f3f4f6;
  display: flex;
  align-items: center;
}

.auth-bg-section { width: 100%; padding: 40px 0; }

.auth-card {
  max-width: 1000px;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0,0,0,.12), 0 4px 16px rgba(0,0,0,.06);
}

/* ── BRAND PANEL ── */
.brand-panel {
  background: linear-gradient(155deg, #C8102E 0%, #9b0c22 50%, #5a0912 100%);
  position: relative;
  overflow: hidden;
  min-height: 560px;
}
.brand-blob { position: absolute; border-radius: 50%; pointer-events: none; }
.brand-blob--tl { width: 320px; height: 320px; top: -120px; right: -80px; background: radial-gradient(circle, rgba(255,255,255,.08) 0%, transparent 65%); }
.brand-blob--br { width: 240px; height: 240px; bottom: -80px; left: -60px; background: radial-gradient(circle, rgba(255,220,80,.07) 0%, transparent 65%); }
.brand-inner { z-index: 1; }
.brand-logo { display: flex; align-items: center; gap: 14px; }
.logo-mark { width: 50px; height: 50px; background: rgba(255,255,255,.15); border: 1.5px solid rgba(255,255,255,.3); border-radius: 14px; display: flex; align-items: center; justify-content: center; font-family: serif; font-size: 1.8rem; font-weight: 700; color: #fff; flex-shrink: 0; }
.brand-name { font-size: 1.25rem; font-weight: 700; letter-spacing: 4px; color: #fff; line-height: 1; }
.brand-sub  { font-size: .5rem; letter-spacing: 3px; color: rgba(255,255,255,.45); margin-top: 4px; text-transform: uppercase; }
.brand-eyebrow { display: inline-flex; align-items: center; gap: 8px; font-size: .65rem; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: rgba(255,255,255,.55); }
.eyebrow-dot { width: 6px; height: 6px; border-radius: 50%; background: rgba(255,255,255,.45); flex-shrink: 0; }
.brand-tagline { font-family: Georgia, serif; font-size: 2.4rem; font-weight: 700; line-height: 1.15; color: #fff; margin: 0; }
.brand-tagline em { font-style: italic; color: rgba(255,255,255,.75); }
.brand-desc { font-size: .8rem; color: rgba(255,255,255,.55); line-height: 1.8; margin: 0; }
.brand-features { display: flex; flex-direction: column; gap: 14px; }
.feat-row { display: flex; align-items: center; gap: 13px; }
.feat-icon { width: 36px; height: 36px; flex-shrink: 0; background: rgba(255,255,255,.12); border: 1px solid rgba(255,255,255,.18); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: .85rem; color: rgba(255,255,255,.85); }
.feat-title { font-size: .8rem; font-weight: 700; color: #fff; line-height: 1.2; }
.feat-sub   { font-size: .68rem; color: rgba(255,255,255,.45); margin-top: 1px; }
.brand-footer-line { width: 100%; height: 1px; background: rgba(255,255,255,.12); margin-bottom: 10px; }
.brand-footer-text { font-size: .6rem; letter-spacing: 1.5px; color: rgba(255,255,255,.3); text-transform: uppercase; }

/* ── FORM PANEL ── */
.form-panel { background: #fff; }
.form-inner { height: 100%; display: flex; flex-direction: column; justify-content: center; }
.view-title { font-family: Georgia, serif; font-size: 2rem; font-weight: 700; color: var(--gray-900); margin: 0; line-height: 1.1; }
.view-sub   { font-size: .83rem; color: var(--gray-600); margin: 0; }

/* ── FIELDS ── */
.field-group { display: flex; flex-direction: column; gap: 6px; }
.field-label { font-size: .78rem; font-weight: 700; color: var(--gray-900); letter-spacing: .3px; }
.field-wrap  { position: relative; }
.field-icon  { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--red); font-size: .9rem; z-index: 2; pointer-events: none; }
.field-input { width: 100%; border: 1.5px solid var(--gray-200); border-radius: 11px; padding: 11px 14px 11px 42px; font-size: .875rem; color: var(--gray-900); background: #fff; transition: border-color .2s, box-shadow .2s; outline: none; }
.field-input:focus { border-color: var(--red); box-shadow: 0 0 0 3px rgba(200,16,46,.1); }
.field-input.is-invalid { border-color: #dc3545; }
.field-input::placeholder { color: var(--gray-400); }
.field-error   { font-size: .72rem; color: #dc3545; font-weight: 500; margin-top: 2px; display: flex; align-items: center; }
.field-success { font-size: .72rem; color: #16a34a; font-weight: 500; margin-top: 2px; display: flex; align-items: center; }
.eye-btn { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); z-index: 5; background: none; border: none; padding: 4px 8px; color: var(--gray-400); cursor: pointer; transition: color .2s; }
.eye-btn:hover { color: var(--red); }

/* ── PASSWORD CHECKER ── */
.pwd-rules { padding: 10px 14px; background: #fde8ec; border-radius: 10px; border: 1px solid rgba(200,16,46,.15); display: flex; flex-direction: column; gap: 5px; }
.pwd-rule  { font-size: .75rem; font-weight: 500; display: flex; align-items: center; transition: color .2s; }
.rule--pass { color: #16a34a; }
.rule--fail  { color: var(--red); }
.pwd-strength  { display: flex; align-items: center; gap: 8px; }
.strength-bars { display: flex; gap: 4px; flex: 1; }
.strength-bar  { flex: 1; height: 4px; border-radius: 4px; background: var(--gray-200); transition: background .3s; }
.strength-bar.active.lvl-1 { background: #ef4444; }
.strength-bar.active.lvl-2 { background: #f97316; }
.strength-bar.active.lvl-3 { background: #eab308; }
.strength-bar.active.lvl-4 { background: #22c55e; }
.strength-label       { font-size: .7rem; font-weight: 700; white-space: nowrap; }
.strength-label.lvl-1 { color: #ef4444; }
.strength-label.lvl-2 { color: #f97316; }
.strength-label.lvl-3 { color: #eab308; }
.strength-label.lvl-4 { color: #22c55e; }

/* ── BUTTONS ── */
.btn-primary { display: inline-flex; align-items: center; justify-content: center; background: linear-gradient(135deg, var(--red) 0%, var(--red-dark) 100%); color: #fff; border: none; border-radius: 11px; padding: 13px 20px; font-size: .875rem; font-weight: 700; cursor: pointer; transition: all .25s; box-shadow: 0 4px 15px rgba(200,16,46,.3); }
.btn-primary:hover:not(:disabled) { background: linear-gradient(135deg, var(--red-dark) 0%, var(--red-deep) 100%); transform: translateY(-2px); box-shadow: 0 8px 24px rgba(200,16,46,.4); }
.btn-primary:disabled { opacity: .65; cursor: not-allowed; transform: none; }
.btn-outline { display: inline-flex; align-items: center; justify-content: center; background: transparent; border: 1.5px solid var(--gray-200); border-radius: 11px; padding: 11px 20px; font-size: .875rem; font-weight: 600; color: var(--gray-600); cursor: pointer; transition: all .2s; }
.btn-outline:hover { border-color: var(--red); color: var(--red); background: #fde8ec; }
.link-red   { background: none; border: none; padding: 0; font-size: .82rem; color: var(--red); cursor: pointer; font-weight: 600; }
.link-red:hover { opacity: .75; }
.link-muted { background: none; border: none; padding: 0; font-size: .82rem; color: var(--gray-400); cursor: pointer; }
.link-muted:hover { color: var(--gray-600); }
.switch-text { font-size: .82rem; color: var(--gray-600); margin: 0; }
.text-red    { color: var(--red); }

/* ── MISC ── */
.error-banner { display: flex; align-items: center; background: #fde8ec; border: 1px solid rgba(200,16,46,.25); color: #8b0d1f; border-radius: 11px; padding: 11px 14px; font-size: .82rem; font-weight: 500; }
.otp-info-box  { display: flex; align-items: center; gap: 14px; background: #fde8ec; border: 1px solid rgba(200,16,46,.2); border-radius: 12px; padding: 14px 16px; }
.otp-info-icon { font-size: 1.5rem; color: var(--red); flex-shrink: 0; }
.otp-info-title{ font-size: .72rem; color: #6b1020; font-weight: 600; }
.otp-info-email{ font-size: .85rem; font-weight: 700; color: var(--red); word-break: break-all; }
.otp-input { width: 100%; border: 2px solid var(--red); border-radius: 12px; padding: 14px; font-size: 1.7rem; font-weight: 700; letter-spacing: 14px; color: var(--red); background: #fff; outline: none; transition: box-shadow .2s; }
.otp-input:focus { box-shadow: 0 0 0 4px rgba(200,16,46,.12); }
.otp-input::placeholder { color: #f0b8c2; letter-spacing: 10px; }

/* ── STEP TRACK ── */
.step-track { display: flex; align-items: flex-start; }
.step-track-item { display: flex; flex-direction: column; align-items: center; flex: 1; position: relative; }
.step-node { width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: .8rem; font-weight: 700; background: #f3f4f6; color: var(--gray-400); border: 2px solid var(--gray-200); transition: all .3s; z-index: 1; }
.step-node.is-active { background: #fde8ec; color: var(--red); border-color: var(--red); }
.step-node.is-done   { background: #dcfce7; color: #16a34a; border-color: #16a34a; }
.step-label { font-size: .65rem; font-weight: 700; text-transform: uppercase; letter-spacing: .5px; color: var(--gray-400); margin-top: 6px; text-align: center; }
.step-connector { position: absolute; top: 17px; left: calc(50% + 17px); width: calc(100% - 34px); height: 2px; background: var(--gray-200); transition: background .3s; z-index: 0; }
.step-connector.is-done { background: #16a34a; }

/* ── TOAST ── */
.custom-toast { background: #fff; min-width: 300px; padding: 14px 18px; border-radius: 14px; border-left: 4px solid var(--red); margin-bottom: 10px; position: relative; overflow: hidden; box-shadow: 0 8px 30px rgba(0,0,0,.1); }
.custom-toast.success { border-left-color: #16a34a; }
.custom-toast.error   { border-left-color: var(--red); }
.toast-icon-wrap { font-size: 1.3rem; padding-top: 1px; flex-shrink: 0; }
.custom-toast.success .toast-icon-wrap { color: #16a34a; }
.custom-toast.error   .toast-icon-wrap { color: var(--red); }
.toast-title { font-size: .78rem; font-weight: 700; color: var(--gray-900); letter-spacing: .5px; text-transform: uppercase; }
.toast-msg   { font-size: .75rem; color: var(--gray-600); margin-top: 2px; }
.toast-bar   { position: absolute; bottom: 0; left: 0; height: 3px; width: 100%; background: rgba(0,0,0,.04); }
.toast-bar::after { content: ''; position: absolute; right: 0; height: 100%; width: 100%; background: var(--red); animation: toast-shrink 3.5s linear forwards; }
.custom-toast.success .toast-bar::after { background: #16a34a; }
@keyframes toast-shrink { from { width: 100%; } to { width: 0%; } }

/* ── TRANSITIONS ── */
.fade-slide-enter-active, .fade-slide-leave-active { transition: all .3s ease; }
.fade-slide-enter-from { opacity: 0; transform: translateX(24px); }
.fade-slide-leave-to   { opacity: 0; transform: translateX(-24px); }
.toast-fade-enter-active, .toast-fade-leave-active { transition: all .4s ease; }
.toast-fade-enter-from { transform: translateX(100%); opacity: 0; }
.toast-fade-leave-to   { transform: translateX(60%);  opacity: 0; }

@media (max-width: 992px) {
  .brand-panel { min-height: 200px; }
  .brand-tagline { font-size: 1.6rem; }
}
</style>
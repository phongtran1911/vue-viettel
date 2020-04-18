<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form ref="loginForm" class="login-form" label-position="left">

        <el-form-item prop="passwordOld" style="width:50%">
          <el-input
            :key="passwordType"
            ref="passwordOld"
            v-model="loginForm.passwordOld"
            :type="passwordType"
            placeholder="Password Old"
            name="passwordOld"
            class="filter-item"
          />
        </el-form-item>
        <el-form-item prop="passwordNew" style="width:50%">
          <el-input
            :key="passwordType"
            ref="passwordNew"
            v-model="loginForm.passwordNew"
            :type="passwordType"
            placeholder="Password New"
            name="passwordNew"
            class="filter-item"
          />
        </el-form-item>
        <el-form-item prop="passwordRe" style="width:50%">
          <el-input
            :key="passwordType"
            ref="passwordRe"
            v-model="loginForm.passwordRe"
            :type="passwordType"
            placeholder="Password Confirm"
            name="passwordRe"
            class="filter-item"
          />
        </el-form-item>

        <el-button type="primary" style="float:left">Change Password</el-button>
      </el-form>
    </div>
  </div>
</template>
<script>

export default {
  name: 'ChangePassword',
  data() {
    // const validateUsername = (rule, value, callback) => {
    //   if (!validUsername(value)) {
    //     callback(new Error('Please enter the correct user name'))
    //   } else {
    //     callback()
    //   }
    // }
    // const validatePassword = (rule, value, callback) => {
    //   if (value.length < 6) {
    //     callback(new Error('The password can not be less than 6 digits'))
    //   } else {
    //     callback()
    //   }
    // }
    return {
      loginForm: {
        passwordOld: '',
        passwordNew: '',
        passwordRe: ''
      },
      //   loginRules: {
      //     username: [{ required: true, trigger: 'blur', validator: validateUsername }],
      //     password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      //   },
      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {}
    }
  }
}
</script>

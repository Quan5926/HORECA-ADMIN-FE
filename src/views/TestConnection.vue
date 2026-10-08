<template>
  <div>
    <h2>Test Backend Connection</h2>
    <p>{{ message }}</p>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      message: "Đang kết nối..."
    };
  },
  mounted() {
    axios.get("/api/test")
      .then(res => {
        this.message = res.data;
      })
      .catch(err => {
        this.message = "Lỗi kết nối backend!";
        console.error(err);
      });
  }
};
</script>

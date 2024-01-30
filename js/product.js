import modal from "../components/modal.js";
import delModal from "../components/delModal.js";
import pagination from "../components/pagination.js";

// productModal/delProductModal 必須是在全域環境宣告，假設直接從 mounted 內宣告，會導致該變數作用域只存在 mounted 範圍內（因為 mounted 也屬於函式）
// 而無法在 openModal 函式中順利取得該變數，導致錯誤
const apiUrl = 'https://ec-course-api.hexschool.io/v2';
const apiPath = 'moreene';

const app = Vue.createApp({
    data() {
        return {
            products: [],
            tempProduct: {
                // 儲存小圖
                imagesUrl: []
            },
            // 判斷：是否為新增產品
            isNew: false,
            isShow: false,
            // 分頁
            totalPage: [],
            pageSize: 5,
            pageNum: 1,
            dataShow: [],
            currentPage: 0
        };
    },
    methods: {
        // 確認使用者權限
        checkLogin() {
            axios.post(`${apiUrl}/api/user/check`)
                .then(res => {
                    this.getProduct();
                    this.isShow = true;
                })
                .catch(err => {
                    alert('您沒有權限進入!');
                    location.href = "index.html";
                });
        },
        // 取得所有產品資訊
        getProduct() {
            axios.get(`${apiUrl}/api/${apiPath}/admin/products`)
                .then(res => {
                    this.products = res.data.products;
                    this.paginated();
                })
                .catch(err => {
                    console.log(err);
                });
        },
        // 分頁
        paginated() {
            this.pageNum = Math.ceil(this.products.length / this.pageSize);
            for (let i = 0; i < this.pageNum; i++) {
                this.totalPage[i] = this.products.slice(this.pageSize * i, this.pageSize * (i + 1));
            };
            this.dataShow = this.totalPage[this.currentPage];
        },
        prePage() {
            if (this.currentPage === 0) {
                return;
            } else {
                this.currentPage--;
                this.dataShow = this.totalPage[this.currentPage];
            };
        },
        nextPage() {
            if (this.currentPage === this.pageNum - 1) {
                return;
            } else {
                this.currentPage++
                this.dataShow = this.totalPage[this.currentPage];
            };
        },
        page(num) {
            this.currentPage = num - 1;
            this.dataShow = this.totalPage[this.currentPage];
        },
        // 打開modal（透過status判斷要打開的哪一個modal）
        openModal(status, item) {
            if (status === 'new') {
                // 新增產品
                this.tempProduct = {};
                this.isNew = true;
                this.$refs.modal.productModal.show();
            } else if (status === 'edit') {
                // 修改產品
                this.tempProduct = { ...item };
                this.isNew = false;
                this.$refs.modal.productModal.show();
            } else if (status === 'delete') {
                // 刪除產品
                this.tempProduct = { ...item };
                this.isNew = false;
                this.$refs.delModal.delProductModal.show();
            };
        },
        // 取消新增產品時，清空輸入框
        clearInput() {
            this.tempProduct = {
                imagesUrl: []
            }
        }
    },
    mounted() {
        const token = document.cookie.replace(
            /(?:(?:^|.*;\s*)myToken\s*\=\s*([^;]*).*$)|^.*$/, "$1",);
        axios.defaults.headers.common['Authorization'] = token;
        this.checkLogin();
    },
});

app.component('modal', modal);
app.component('delModal', delModal);
app.component('pagination', pagination);
app.mount("#app");
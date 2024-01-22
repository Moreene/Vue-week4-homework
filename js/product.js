// productModal/delProductModal 必須是在全域環境宣告，假設直接從 mounted 內宣告，會導致該變數作用域只存在 mounted 範圍內（因為 mounted 也屬於函式）
// 而無法在 openModal 函式中順利取得該變數，導致錯誤
let productModal = null;
let delProductModal = null;

const app = Vue.createApp({
    data() {
        return {
            apiUrl: 'https://ec-course-api.hexschool.io/v2',
            apiPath: 'moreene',
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
            axios.post(`${this.apiUrl}/api/user/check`)
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
            axios.get(`${this.apiUrl}/api/${this.apiPath}/admin/products`)
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
                productModal.show();
            } else if (status === 'edit') {
                // 修改產品
                this.tempProduct = { ...item };
                this.isNew = false;
                productModal.show();
            } else if (status === 'delete') {
                // 刪除產品
                this.tempProduct = { ...item };
                this.isNew = false;
                delProductModal.show();
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


// 新增/編輯產品modal
app.component('modal', {
    props: ['tempProduct', 'isNew', 'clearInput'],
    template: `
    <div id="productModal" ref="productModal" class="modal fade" tabindex="-1" aria-labelledby="productModalLabel"
        aria-hidden="true">
        <div class="modal-dialog modal-xl">
            <div class="modal-content border-0">
                <div class="modal-header bg-info text-white">
                    <h5 id="productModalLabel" class="modal-title">
                        <span>{{ isNew ? '新增產品' : tempProduct.title }}</span>
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"
                        @click="clearInput"></button>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col-sm-4">
                            <div class="mb-2">
                                <div class="mb-3">
                                    <label for="imageUrl" class="form-label">新增主圖</label>
                                    <input type="text" class="form-control" v-model="tempProduct.imageUrl"
                                        placeholder="請輸入圖片連結">
                                </div>
                                <img class="img-fluid" :src="tempProduct.imageUrl" alt="">
                            </div>
                            <div class="mb-2" v-if="tempProduct.imagesUrl">
                                <div class="mb-3" v-for="(item, idx) in tempProduct.imagesUrl" :key="'img' + idx">
                                    <label for="imageURL" class="form-label">圖片{{ idx + 1 }}</label>
                                    <input v-model="tempProduct.imagesUrl[idx]" type="text" class="form-control"
                                        placeholder="請輸入圖片連結">
                                    <img class="img-fluid" v-if="item.length" :src="item">
                                </div>
                                <div v-if="!tempProduct.imagesUrl.length || tempProduct.imagesUrl.at(-1)">
                                    <button class="btn btn-outline-primary btn-sm d-block w-100"
                                        @click="tempProduct.imagesUrl.push('')">
                                        新增圖片
                                    </button>
                                </div>
                                <div v-else>
                                    <button class="btn btn-outline-danger btn-sm d-block w-100"
                                        @click="tempProduct.imagesUrl.pop()">
                                        刪除圖片
                                    </button>
                                </div>
                            </div>
                            <div v-else>
                                <button class="btn btn-outline-primary btn-sm d-block w-100"
                                    @click="tempProduct.imagesUrl=['']">
                                    新增圖片
                                </button>
                            </div>
                        </div>
                        <div class="col-sm-8">
                            <div class="mb-3">
                                <label for="title" class="form-label">標題</label>
                                <input id="title" type="text" class="form-control" placeholder="請輸入標題"
                                    v-model="tempProduct.title">
                            </div>
                            <div class="row">
                                <div class="mb-3 col-md-6">
                                    <label for="category" class="form-label">分類</label>
                                    <input id="category" type="text" class="form-control" placeholder="請輸入分類"
                                        v-model="tempProduct.category">
                                </div>
                                <div class="mb-3 col-md-6">
                                    <label for="price" class="form-label">單位</label>
                                    <input id="unit" type="text" class="form-control" placeholder="請輸入單位"
                                        v-model="tempProduct.unit">
                                </div>
                            </div>
                            <div class="row">
                                <div class="mb-3 col-md-6">
                                    <label for="origin_price" class="form-label">原價</label>
                                    <input id="origin_price" type="number" min="0" class="form-control" placeholder="請輸入原價"
                                        v-model.number="tempProduct.origin_price">
                                </div>
                                <div class="mb-3 col-md-6">
                                    <label for="price" class="form-label">售價</label>
                                    <input id="price" type="number" min="0" class="form-control" placeholder="請輸入售價"
                                        v-model.number="tempProduct.price">
                                </div>
                            </div>
                            <hr>
                            <div class="mb-3">
                                <label for="description" class="form-label">產品描述</label>
                                <textarea id="description" type="text" class="form-control" placeholder="請輸入產品描述"
                                    v-model="tempProduct.description"></textarea>
                            </div>
                            <div class="mb-3">
                                <label for="content" class="form-label">說明內容</label>
                                <textarea id="description" type="text" class="form-control" placeholder="請輸入說明內容"
                                    v-model="tempProduct.content"></textarea>
                            </div>
                            <div class="mb-3">
                                <div class="form-check">
                                    <input id="is_enabled" class="form-check-input" type="checkbox"
                                        v-model="tempProduct.is_enabled">
                                    <label class="form-check-label" for="is_enabled">是否啟用</label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal" @click="clearInput">
                            取消
                        </button>
                        <button type="button" class="btn btn-primary" @click = "updateProduct" >
                            確認
                        </button >
                    </div >
                </div >
            </div >
        </div >
    </div >`
    ,
    data() {
        return {
            apiUrl: 'https://ec-course-api.hexschool.io/v2',
            apiPath: 'moreene',
        }
    },
    mounted() {
        productModal = new bootstrap.Modal(document.getElementById('productModal'), {
            keyboard: false,
            backdrop: 'static'
        });
    },
    methods: {
        updateProduct() {
            let url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`;
            let http = 'put';

            if (this.isNew) {
                url = `${this.apiUrl}/api/${this.apiPath}/admin/product`;
                http = 'post'
            };
            axios[http](url, { data: this.tempProduct })
                .then((res) => {
                    alert(res.data.message);
                    productModal.hide();
                    this.$emit('update');
                }).catch((err) => {
                    alert(err.data.message);
                });
        },
    }
});

// 刪除產品modal
app.component('delModal', {
    props: ['tempProduct'],
    template: `
    <div id="delProductModal" ref="delProductModal" class="modal fade" tabindex="-1" aria-labelledby="delProductModalLabel"
        aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content border-0">
                <div class="modal-header bg-danger text-white">
                    <h5 id="delProductModalLabel" class="modal-title">
                        <span>{{ tempProduct.title }}</span>
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    是否刪除
                    <strong class="text-danger"></strong> 商品(刪除後將無法恢復)。
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
                        取消
                    </button>
                    <button type="button" class="btn btn-danger" @click="delProduct">
                        確認刪除
                    </button>
                </div>
            </div>
        </div>
    </div>`,
    data() {
        return {
            apiUrl: 'https://ec-course-api.hexschool.io/v2',
            apiPath: 'moreene',
        }
    },
    mounted() {
        delProductModal = new bootstrap.Modal(document.getElementById('delProductModal'), {
            keyboard: false,
            backdrop: 'static'
        });
    },
    methods: {
        delProduct() {
            const url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`;
            axios.delete(url).then((res) => {
                alert(res.data.message);
                delProductModal.hide();
                this.$emit('delete');
            }).catch((err) => {
                alert(err.response.data.message);
            });
        },
    }
});

// 分頁元件
app.component('pagination',{
    props:['currentPage','pageNum'],
    template:`
    <div class="d-flex justify-content-center mt-4">
        <nav aria-label="Page navigation">
            <ul class="pagination" id="pageid">
                <li class="page-item" :class="{'disabled':currentPage === 0 }">
                    <a class="page-link" href="#" @click.prevent="$emit('prePage')">&laquo;</a></li>
                <li class="page-item" v-for="num in pageNum" :key="num"
                    :class="{ 'active': num === currentPage + 1 }">
                    <a class="page-link" href="#" @click.prevent="$emit('clickPage',num)">{{ num }}</a>
                </li>
                <li class="page-item" :class="{'disabled':currentPage === pageNum - 1}">
                    <a class="page-link" href="#" @click.prevent="$emit('nextPage')">&raquo;</a></li>
            </ul>
        </nav>
    </div>`,
});

app.mount("#app");
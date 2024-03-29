// 新增/編輯產品modal
export default {
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
                                    <input type="text" class="form-control" id="imageUrl" v-model="tempProduct.imageUrl"
                                        placeholder="請輸入圖片連結">
                                </div>
                                <img class="img-fluid" :src="tempProduct.imageUrl" alt="">
                            </div>
                            <div class="mb-2" v-if="tempProduct.imagesUrl">
                                <div class="mb-3" v-for="(item, idx) in tempProduct.imagesUrl" :key="'img' + idx">
                                    <label :for="'imageURL'+ idx" class="form-label">圖片{{ idx + 1 }}</label>
                                    <input v-model="tempProduct.imagesUrl[idx]" type="text" class="form-control" :id="'imageURL'+ idx"
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
            productModal: null,
            apiUrl: 'https://ec-course-api.hexschool.io/v2',
            apiPath: 'moreene'
        }
    },
    mounted() {
        this.productModal = new bootstrap.Modal(this.$refs.productModal, {
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
                    this.productModal.hide();
                    this.$emit('update');
                }).catch((err) => {
                    alert(err.data.message);
                });
        },
    }
}
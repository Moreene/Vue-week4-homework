// 刪除產品modal
export default {
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
            delProductModal: null,
            apiUrl: 'https://ec-course-api.hexschool.io/v2',
            apiPath: 'moreene'
        }
    },
    mounted() {
        this.delProductModal = new bootstrap.Modal(this.$refs.delProductModal, {
            keyboard: false,
            backdrop: 'static'
        });
    },
    methods: {
        delProduct() {
            const url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`;
            axios.delete(url).then((res) => {
                alert(res.data.message);
                this.delProductModal.hide();
                this.$emit('delete');
            }).catch((err) => {
                alert(err.response.data.message);
            });
        },
    }
}
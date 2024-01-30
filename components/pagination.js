export default {
    props: ['currentPage', 'pageNum'],
    template: `
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
}
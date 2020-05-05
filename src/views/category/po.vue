<template>
    <div class="app-container">
        <el-table
            :key="tableKey"
            v-loading="listLoading"
            :data="list"
            border
            fit
            highlight-current-row
            style="width: 100%;"
        >
            <el-table-column label="Poid" prop="Poid" sortable="custom" align="center" width="80">
                <template slot-scope="{row}">
                    <span>{{ row.Poid }}</span>
                </template>
            </el-table-column>
            <el-table-column label="Mã PO" min-width="100px">
                <template slot-scope="{row}">
                    <span>{{ row.Po }}</span>
                </template>
            </el-table-column>     
            <el-table-column label="Tên đăng nhập" min-width="100px">
                <template slot-scope="{row}">
                    <span> {{ row.Username }} </span>
                </template>
            </el-table-column>
            <el-table-column label="Tổng tiền" min-width="100px">
                <template slot-scope="{row}">
                    <span> {{ row.Totalamount }} </span>
                </template>
            </el-table-column>
            <el-table-column label="Địa chỉ" min-width="200px">
                <template slot-scope="{row}">
                    <span> {{ row.FullAddress }} </span>
                </template>
            </el-table-column>
            <el-table-column label="Trạng thái" class-name="status-col" width="100">
                <template slot-scope="{row}">
                    <el-tag :type="row.LastStatus | statusFilter">
                        {{ row.LastStatus }}
                    </el-tag>
                </template>
            </el-table-column>
        </el-table>
        <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    </div>
</template>
<script>
import { getList } from '@/api/po'
import { getToken } from '@/utils/auth';
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
export default {
    name: 'PO List',
    components: { Pagination },
    directives: { waves },
    filters: {
        statusFilter(status) {
            const statusMap = {
                NEW: 'info',
                recieved: 'info',
                approved: 'success',
                Tracking: 'success',
                huy: 'danger'
            }
            return statusMap[status]
        }
    },
    data() {
        return {
            tableKey: 0,
            list: null,
            total: 0,
            listLoading: false,
            listQuery: {
                page: 1,
                limit: 10,
                importance: undefined,
                title: undefined,
                type: undefined,
                sort: '+id',
            },
        }
    },
    created() {
        this.getList()        
    },
    methods: {
        getList() {
            this.listLoading = true;
            getList(getToken()).then(response => {
                var listHandle = response.listpo.Data;
                this.list = listHandle.filter((item, index) => index < this.listQuery.limit * this.listQuery.page && index >= this.listQuery.limit * (this.listQuery.page - 1))
                this.total = response.listpo.Total

                // Just to simulate the time of the request
                setTimeout(() => {
                    this.listLoading = false
                }, 1.5 * 1000)
            })
        },
    }
}
</script>
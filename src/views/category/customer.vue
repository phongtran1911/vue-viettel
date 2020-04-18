<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.title"
        placeholder="User Name"
        style="width: 500px;"
        class="filter-item"
      />
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
      >Search</el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
      >Add</el-button>
    </div>
     <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="ID" prop="Id" sortable="custom" align="center" width="80">
        <template slot-scope="{row}">
          <span>{{ row.Id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Username" min-width="100px">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.Username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Fullname" width="120px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.Lastname + row.Firstname }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Address" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.DiaChi }}</span>
        </template>
      </el-table-column>      
      <el-table-column label="Active" class-name="status-col" width="100">
        <template slot-scope="{row}">
          <el-tag :type="row.Active | statusFilter">
            {{ row.Active }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Actions" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            Edit
          </el-button>
          <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleModifyStatus(row,'deleted')">
            Delete
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>
<script>
import { getList } from "@/api/customer";
import { getToken } from '@/utils/auth';
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import store from '@/store'
export default {
    name: 'CustomerManager',
    components: { Pagination },
    directives: { waves },
    filters: {
        statusFilter(status) {
            const statusMap = {
                true: 'success',
                false: 'danger'
            }
            return statusMap[status]
        }
    },
    data() {
        return {
            tableKey: 0,
            list: null,
            total: 0,
            listLoading: true,
            listQuery: {
                page: 1,
                limit: 20,
                importance: undefined,
                title: undefined,
                type: undefined,
                sort: '+id'
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
                    this.list = response.Data
                    this.total = response.Total

                    // Just to simulate the time of the request
                    setTimeout(() => {
                        this.listLoading = false
                    }, 1.5 * 1000)
            })
            .catch(error => console.log(error))
        }
    }
};
</script>
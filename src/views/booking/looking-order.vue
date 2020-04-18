<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.OrderCode" placeholder="Mã vận đơn" style="width: 40%" class="filter-item" />
      <el-input v-model="listQuery.PhoneName" placeholder="Tên/SĐT người nhận" style="width: 40%; margin-left: 2%;" class="filter-item" />
    </div>
    <div class="filter-container">
      <el-select v-model="listQuery.Status" :multiple="true" placeholder="Tình trạng giao hàng" clearable class="filter-item" style="width: 40%">
        <el-option v-for="item in statusTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
      </el-select>
      <el-select v-model="listQuery.Package" :multiple="true" placeholder="Gói cước" clearable class="filter-item" style="width: 40%; margin-left: 2%;">
        <el-option v-for="item in packagesTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
      </el-select>
    </div>
    <div class="filter-container">
      <el-date-picker v-model="listQuery.fromDate" type="datetime" format="yyyy-MM-dd HH:mm:ss" placeholder="Từ ngày" style="width: 40%" />
      <el-date-picker v-model="listQuery.toDate" type="datetime" format="yyyy-MM-dd HH:mm:ss" placeholder="Đến ngày" style="width: 40%; margin-left: 2%;" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" style="margin-left: 2%;">
        Search
      </el-button>
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="ID" width="80">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column width="180px" align="center" label="Date">
        <template slot-scope="{row}">
          <span>{{ row.timestamp | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="Author">
        <template slot-scope="{row}">
          <span>{{ row.author }}</span>
        </template>
      </el-table-column>

      <el-table-column width="100px" label="Importance">
        <template slot-scope="{row}">
          <svg-icon v-for="n in + row.importance" :key="n" icon-class="star" class="meta-item__icon" />
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" label="Status" width="110">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column min-width="300px" label="Title">
        <template slot-scope="{row}">
          <template v-if="row.edit">
            <el-input v-model="row.title" class="edit-input" size="small" />
            <el-button
              class="cancel-btn"
              size="small"
              icon="el-icon-refresh"
              type="warning"
              @click="cancelEdit(row)"
            >
              cancel
            </el-button>
          </template>
          <span v-else>{{ row.title }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="Actions" width="120">
        <template slot-scope="{row}">
          <el-button
            v-if="row.edit"
            type="success"
            size="small"
            icon="el-icon-circle-check-outline"
            @click="confirmEdit(row)"
          >
            Ok
          </el-button>
          <el-button
            v-else
            type="primary"
            size="small"
            icon="el-icon-edit"
            @click="row.edit=!row.edit"
          >
            Edit
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import { fetchList } from '@/api/article'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

const statusTypeOptions = [
  { key: 'CN', display_name: 'Chờ giao hàng' },
  { key: 'US', display_name: 'Chờ trả hàng' },
  { key: 'JP', display_name: 'Đang lấy hàng' },
  { key: 'EU', display_name: 'Giao hàng thành công' }
]
const packagesTypeOptions = [
  { key: 'CN', display_name: 'Gói giao nhanh' },
  { key: 'US', display_name: 'Gói tiết kiệm' },
  { key: 'JP', display_name: 'Gói hỏa tốc' },
  { key: 'EU', display_name: 'Gói 4 giờ' }
]
export default {
  name: 'LookingOrder',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
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
        limit: 10,
        Package: undefined,
        Status: undefined,
        OrderCode: undefined,
        PhoneName: undefined,
        fromDate: undefined,
        toDate: undefined
      },
      packagesTypeOptions,
      statusTypeOptions,
      downloadLoading: false,
      dataSource: [],
      columns: ['Id', 'UserName', 'LastName', 'FirstName', 'Email', 'Male', 'Birthday', 'FullAddress']
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      this.listLoading = true
      const { data } = await fetchList(this.listQuery)
      const items = data.items
      this.total = data.total
      this.list = items.map(v => {
        this.$set(v, 'edit', false) // https://vuejs.org/v2/guide/reactivity.html
        v.originalTitle = v.title //  will be used when user click the cancel botton
        return v
      })
      this.listLoading = false
    },
    cancelEdit(row) {
      row.title = row.originalTitle
      row.edit = false
      this.$message({
        message: 'The title has been restored to the original value',
        type: 'warning'
      })
    },
    confirmEdit(row) {
      row.edit = false
      row.originalTitle = row.title
      this.$message({
        message: 'The title has been edited',
        type: 'success'
      })
    }
  }
}
</script>

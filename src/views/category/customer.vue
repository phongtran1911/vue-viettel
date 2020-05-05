<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.Username"
        placeholder="Tên đăng nhập"
        style="width: 500px;"
        class="filter-item"
      />
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
      >Tìm kiếm</el-button>
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
      <el-table-column label="Tên đăng nhập" min-width="70px">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.Username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Tên khách hàng" min-width="80px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.Lastname + row.Firstname }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Địa chỉ" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.DiaChi }}</span>
        </template>
      </el-table-column>      
      <el-table-column label="Kích hoạt" class-name="status-col" width="100">
        <template slot-scope="{row}">
          <el-tag :type="row.Active | statusFilter">
            {{ row.Active }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Hoạt động" align="center" width="250" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="success" size="mini" @click="handleActive(row)" style="width:70px;">
            Kích hoạt
          </el-button>
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            Sửa
          </el-button>
          <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleModifyStatus(row,'deleted')" disabled="true">
            Xóa
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    <el-dialog title="Sửa khách hàng" :visible.sync="dialogFormVisible" style="margin-top:-8vh;">
      <el-form ref="dataForm" :model="temp" label-position="left" label-width="150px" style="width: 400px; margin-left:50px;">
        <el-form-item label="ID" prop="Id">
          <span style="color:red">{{ temp.Id }}</span>
        </el-form-item>
        
        <el-form-item label="Mã khách hàng (*)" prop="CustomerCode">
          <el-input v-model="temp.CustomerCode" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          Hủy
        </el-button>
        <el-button type="primary" @click="updateData()">
          Xác nhận
        </el-button>
      </div>
    </el-dialog>
    <el-dialog title="Kích hoạt khách hàng" :visible.sync="dialogFormVisibleActive" style="margin-top:-8vh;">
      <el-form ref="dataFormActive" :model="temp" label-position="left" label-width="150px" style="width: 400px; margin-left:50px;">
        <span>Bạn có muốn kích hoạt khách hàng {{ temp.Lastname + temp.Firstname }} này?</span>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleActive = false">
          Hủy
        </el-button>
        <el-button type="primary" @click="acitveData()">
          Xác nhận
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getList, postUpdateProfile, postActiveUser } from "@/api/customer";
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
                limit: 10,
                importance: undefined,
                Username: undefined,
                type: undefined,
                sort: '+id'
            },
            temp: {
                Id: undefined,
                CustomerCode: '',
                Active: false,
            },
            dialogFormVisible: false,
            dialogFormVisibleActive: false,
            dialogStatus: '',
            textMap: {
                update: 'Sửa'
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
                    var listHandle = response.Data;
                    this.list = listHandle.filter((item, index) => index < this.listQuery.limit * this.listQuery.page && index >= this.listQuery.limit * (this.listQuery.page - 1))
                    this.total = response.Total

                    // Just to simulate the time of the request
                    setTimeout(() => {
                        this.listLoading = false
                    }, 1.5 * 1000)
            })
            .catch(error => console.log(error))
        },
        handleFilter() {
            this.listQuery.page = 1
            this.getList()
        },
        handleUpdate(row) {
            var handleRow = {
              Active: row.Active,
              CustomerCode: row.CustomerCode,
              Id: row.Id
            }
            this.temp = Object.assign({}, handleRow) // copy obj
            this.dialogStatus = 'update'
            this.dialogFormVisible = true
            this.$nextTick(() => {
                this.$refs['dataForm'].clearValidate()
            })
        },
        handleActive(row) {
          var handleRow = {
            username: row.Username,
            Lastname: row.Lastname,
            Firstname: row.Firstname
          }
          this.temp = Object.assign({}, handleRow) // copy obj
          this.dialogFormVisibleActive = true
          this.$nextTick(() => {
              this.$refs['dataFormActive'].clearValidate()
          })
        },
        acitveData() {
          const tempData = Object.assign({}, this.temp)
          postActiveUser(tempData, getToken()).then(response => {
            if(response.Code === 0 || response.Code === '0')
                {
                    this.dialogFormVisibleActive = false
                    this.handleFilter()
                    this.$notify({
                        title: 'Success',
                        message: 'Kích hoạt thành công',
                        type: 'success',
                        duration: 2000
                    })
                }
          })
        },
        updateData() {
            if(this.temp.CustomerCode == '')
            {
              this.$notify({
                        title: 'Warning',
                        message: 'Điền vào các dấu (*), làm ơn!',
                        type: 'warning',
                        duration: 2000
                    })
              return;
            }
            const tempData = Object.assign({}, this.temp)
            postUpdateProfile(tempData, getToken()).then(response => {
                if(response.Code === 0 || response.Code === '0')
                {
                    this.dialogFormVisible = false
                    this.handleFilter()
                    this.$notify({
                        title: 'Success',
                        message: 'Cập nhật thành công!',
                        type: 'success',
                        duration: 2000
                    })
                }
                else
                {
                    this.$notify({
                        title: 'Error',
                        message: 'Cập nhật thất bại!',
                        type: 'error',
                        duration: 2000
                    })
                }                                
            })
        }
    }
};
</script>
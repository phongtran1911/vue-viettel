<template>
  <div class="app-container">
    <div class="filter-container">
        <el-select v-model="listQuery.CatId" style="width: 500px" class="filter-item" @change="handleFilter" placeholder="Choose Category to search...">
            <el-option v-for="item in listCat" :key="item.Id" :label="item.Name" :value="item.Id" />
        </el-select>
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit"  @click="handleCreate" :disabled="listQuery.CatId === undefined">
            Add
        </el-button>
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
      <el-table-column label="Name" min-width="200px">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.Name }}</span>
        </template>
      </el-table-column>     
      <el-table-column label="Home" class-name="status-col" width="100">
        <template slot-scope="{row}">
          <el-tag :type="row.HomeAppear | statusFilter">
            {{ row.HomeAppear }}
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
    
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :model="temp" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="ID" prop="Id" :hidden="dialogStatus === 'create'">
          <span style="color:red">{{ temp.Id }}</span>
        </el-form-item>
        <el-form-item label="Group_ID" prop="group_id" :hidden="dialogStatus === 'create'">
          <span style="color:red">{{ temp.group_id }}</span>
        </el-form-item>
        <el-form-item label="Name (*)" prop="Name">
          <el-input v-model="temp.Name" />
        </el-form-item>
        <el-form-item :label="dialogStatus === 'create' ? 'Category' : 'Category (*)'" prop="type">
          <el-select v-model="temp.category_id" class="filter-item" placeholder="Please select" :disabled="dialogStatus === 'create'">
            <el-option label="" value=""/>
            <el-option v-for="item in listCat" :key="item.Id" :label="item.Name" :value="item.category_id" />
          </el-select>
        </el-form-item>
        <el-form-item label="Active" prop="Active">
          <el-checkbox v-model="temp.Active" />
        </el-form-item>
        <el-form-item label="Home" prop="HomeAppear">
          <el-checkbox v-model="temp.HomeAppear" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          Cancel
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          Confirm
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getListCategory,getListProductGroup, putCreateGroup, postCreateGroup } from '@/api/productgroup'
import { getToken } from '@/utils/auth';
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
    name: 'ProductGroup',
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
            listCat: null,
            tableKey: 0,
            list: null,
            total: 0,
            listLoading: false,
            listQuery: {
                page: 1,
                limit: 20,
                importance: undefined,
                title: undefined,
                type: undefined,
                sort: '+id',
                CatId: undefined,
                CatIdCreate: undefined
            },
            temp: {
                Id: undefined,
                Name: '',
                Active: false,
                Cateid: '',
                group_id: '',
                category_id: '',
                HomeAppear: false
            },
            dialogFormVisible: false,
            dialogStatus: '',
            textMap: {
                update: 'Edit',
                create: 'Create'
            },
        }
    },
    created() {
        this.getListCat()
    },
    methods: {
        getListCat() {
            getListCategory(getToken()).then(response => {
                this.listCat = response.Data.Data;
            })
        },
        getList() {
            this.listLoading = true;
            getListProductGroup(this.listQuery.CatId, getToken()).then(response => {
                this.list = response.Data.Data
                this.total = response.Data.Total

                // Just to simulate the time of the request
                setTimeout(() => {
                    this.listLoading = false
                }, 1.5 * 1000)
            })
        },
        handleFilter() {
            this.listQuery.page = 1
            this.getList()
        },
        setCatId() {
            for(let i = 0; i < this.listCat.length; i++)
            {
                if(this.listCat[i].category_id === this.listQuery.CatId)
                {
                    this.listQuery.CatIdCreate = this.listCat[i].Id
                    break
                }
            }
        },
        resetTemp() {
            this.temp = {
                Name: '',
                Active: false,
                category_id: this.listQuery.CatId,
                HomeAppear: false
            }
        },
        handleCreate() {
            this.resetTemp()
            this.dialogStatus = 'create'
            this.dialogFormVisible = true
            this.$nextTick(() => {
                this.$refs['dataForm'].clearValidate()
            })
        },
        createData() {
            if(this.temp.Name == '')
            {
              this.$notify({
                        title: 'Warning',
                        message: 'Fill the name option, please!',
                        type: 'warning',
                        duration: 2000
                    })
              return;
            }
            postCreateGroup(this.temp, getToken()).then(response => {
                if(response.Code === 0 || response.Code === '0')
                {
                    this.dialogFormVisible = false
                    this.handleFilter()
                    this.$notify({
                        title: 'Success',
                        message: 'Created Successfully',
                        type: 'success',
                        duration: 2000
                    })
                }
                else
                {
                    this.$notify({
                        title: 'Error',
                        message: 'Create Failed',
                        type: 'error',
                        duration: 2000
                    })
                }
            })
        },
        handleUpdate(row) {
            this.temp = Object.assign({}, row) // copy obj
            this.dialogStatus = 'update'
            this.dialogFormVisible = true
            this.$nextTick(() => {
                this.$refs['dataForm'].clearValidate()
            })
        },
        updateData() {
            if(this.temp.Name == '' || this.temp.category_id == '')
            {
              this.$notify({
                        title: 'Warning',
                        message: 'Fill the (*) option, please!',
                        type: 'warning',
                        duration: 2000
                    })
              return;
            }
            const tempData = Object.assign({}, this.temp)
            putCreateGroup(tempData, getToken()).then(response => {
                if(response.Code === 0 || response.Code === '0')
                {
                    this.dialogFormVisible = false
                    this.handleFilter()
                    this.$notify({
                        title: 'Success',
                        message: 'Update Successfully',
                        type: 'success',
                        duration: 2000
                    })
                }
                else
                {
                    this.$notify({
                        title: 'Error',
                        message: 'Update Failed',
                        type: 'error',
                        duration: 2000
                    })
                }                                
            })
        }
    }
}
</script>
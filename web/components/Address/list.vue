<template>
	<div>
    <div class="address-list" v-loading="loading">
      <div class="address-item" v-for="(item, index) in list" :key="index">
        <div class="item-on" :class="{on:item.on && select}" @click="switchAddress(item)">
          <div class="address-info">
            <div class="name">
              {{ item.name }}
              <span v-if="item.defaults">默认</span>
            </div>
            <div class="cellphone">{{ item.cellphone }}</div>
            <div class="address-con">{{ item.location ? item.location + '(' : '' }}{{ item.address }} {{ item.house ? ')' + item.house : '' }}</div>
            <div class="address-action">
              <el-link v-if="!select" type="danger" :underline="false" @click="defaultAddress(item)">设为默认</el-link>
              <el-link type="danger" :underline="false" @click="updateAddress(item)">修改</el-link>
              <el-link v-if="!select" type="danger" :underline="false" @click="deleteAddress(item)">删除</el-link>
            </div>
          </div>
        </div>
      </div>
      <div class="address-item" @click="updateAddress">
        <div class="item">
          <div class="add-desc">
            <div><i class="el-icon-circle-plus"></i></div>
            <div>添加新地址</div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="centerDialogVisible"
      :close-on-click-modal="false"
      width="600px">
      <el-form class="ruleForm" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
        <el-form-item label="联系人" prop="name">
          <el-input v-model="ruleForm.name" clearable maxlength="20" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="cellphone">
          <el-input v-model="ruleForm.cellphone" clearable maxlength="11" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="location">
          <el-autocomplete
            v-model="ruleForm.location"
            popper-class="my-autocomplete"
            :fetch-suggestions="querySearch"
            placeholder="例如：宁波 天一广场"
            :trigger-on-focus="false"
            @select="handleSelect"
            style="width: 100%"
          >
            <template slot-scope="{ item }">
              <div class="name">{{ item.value }}</div>
              <span class="addr">{{ item.adname + ' ' + item.address }}</span>
            </template>
          </el-autocomplete>
          <div>输入完成后如没有想要的地址，可以多输入一个空格，在弹出列表中选择所在地区</div>
        </el-form-item>
        <el-form-item label="门牌号" prop="house">
          <el-input v-model="ruleForm.house" clearable maxlength="80" placeholder="请输入门牌号"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button :loading="buttonLoading" @click="centerDialogVisible = false">取 消</el-button>
        <el-button :loading="buttonLoading" type="danger"  @click="submitForm('ruleForm')">确 定</el-button>
      </span>
    </el-dialog>
	</div>
</template>

<script>
import { create, getList, edit, destroy, defaultSet } from '@/api/shipping'
export default{
	name: 'AddressList',
  props: {
    select: {
      type: Boolean,
      default: false
    }
  },
	data() {
    const validateCellphone = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入手机号'));
      } else {
        const myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(16[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
        if (!myreg.test(value)) {
          callback(new Error('手机号格式有误'));
        }
        callback();
      }
    };
		return {
      restaurants: [],
      buttonLoading: false,
      loading: false,
      dialogTitle: '添加收货地址',
      centerDialogVisible: false,
      list: [],
      ruleForm: {
        location: '',
        address: '',
        name: '',
        house: '',
        cellphone: '',
        latitude: '',
        longitude: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
        ],
        cellphone: [
          { validator: validateCellphone, trigger: 'blur' }
        ],
        location: [
          { required: true, message: '请输入地址', trigger: 'blur' },
        ],
        house: [
          { required: true, message: '请输入门牌号', trigger: 'blur' },
        ],
      }
		};
	},
	watch: {
		/*getList(newVal) {
			this.$emit('getList', newVal)
			this.getLists = this.getList
			if(!this.update){
				this.loadData()
			}
		},*/

	},
  mounted() {
    this.getList()
  },
	methods:{
    async getList(){
      this.loading = true;
      await getList({
        sort: '-defaults'
      }).then(response => {
        this.loading = false;
        this.list = response.data
        this.list.forEach(item=>{
          if(item.defaults){
            item.on = true
            this.$emit('selectedAddress',item)
          }else{
            item.on = false
          }
        })
      }).catch(() => {
        this.loading = false
      })
    },
    // 切换地址
    switchAddress(res){
      if(this.select){
        this.list.forEach(item=>{
          item.on = false
        })
        res.on = true
        this.$emit('selectedAddress',res)
        this.$forceUpdate()
      }
    },
    submitForm(){
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.buttonLoading = true;
          if(this.ruleForm.id){
            edit(this.ruleForm).then(response => {
              this.buttonLoading = false;
              this.centerDialogVisible = false
              this.$refs['ruleForm'].resetFields();
              this.getList()
              this.$message({
                message: '修改成功',
                type: 'success'
              });
            }).catch(() => {
              this.buttonLoading = false
            })
          }else{
            create(this.ruleForm).then(response => {
              this.buttonLoading = false
              this.centerDialogVisible = false
              this.$refs['ruleForm'].resetFields();
              this.getList()
              this.$message({
                message: '添加成功',
                type: 'success'
              });
            }).catch(() => {
              this.buttonLoading = false
            })
          }
        }
      })
    },
    defaultAddress(item){
      this.$confirm('是否设为默认？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.buttonLoading = true
        defaultSet(item).then(response => {
          this.buttonLoading = false;
          this.getList()
          this.$message({
            message: '设置成功',
            type: 'success'
          });
        }).catch(() => {
          this.buttonLoading = false
        })
      }).catch(() => {
      })
    },
    deleteAddress(item){
      if(item.defaults){
        this.$message({
          message: '默认地址无法删除',
          type: 'error'
        })
        return
      }
      this.$confirm('确定要删除该地址吗？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.buttonLoading = true
        destroy(item.id).then(response => {
          this.buttonLoading = false;
          this.getList()
          this.$message({
            message: '删除成功',
            type: 'success'
          });
        }).catch(() => {
          this.buttonLoading = false
        })
      }).catch(() => {
      })
    },
    updateAddress(item){
      if(item.id){
        this.ruleForm = item
        this.dialogTitle = '修改收货地址'
      }else{
        this.ruleForm = {
          location: '',
          address: '',
          name: '',
          house: '',
          cellphone: '',
          latitude: '',
          longitude: ''
        }
        this.dialogTitle = '添加收货地址'
      }
      this.centerDialogVisible = true
    },
    querySearch(queryString, cb) {
      let restaurants = this.restaurants;
      $nuxt.$axios
        .get(process.env.IBS_URL + '/place/text',{
          params: {
            keywords: queryString,
            key: process.env.IBS_KEY
          }
        })
        .then((response) => {
          if(response.data.info === 'OK'){
            restaurants = response.data.pois
            restaurants.forEach(item=>{
              item.value = item.name
            })
            this.restaurants = restaurants
          }else{
            console.log('没有查询结果')
          }
        }).catch((response) => {
        console.log('response',response)
      })
      this.$forceUpdate()
      cb(restaurants);
    },
    handleSelect(item) {
      const location = item.location.split(",")
      this.ruleForm.address = item.address
      this.ruleForm.longitude = location[0]
      this.ruleForm.latitude = location[1]
    }
	},
}
</script>

<style lang="scss" scoped>
  .address-list{
    display: flex;
    flex-wrap: wrap;
    align-content: center;
    .address-item{
      width: 25%;
      padding-right: 10px;
      padding-bottom: 10px;
      .item{
        cursor:pointer;
        border: 1px solid #e0e0e0;
        display: flex;
        justify-content: center;
        align-items:center;
        height: 180px;
        .add-desc{
          text-align: center;
          color: #b0b0b0;
          i{
            color: #e0e0e0;
            font-size: 32px;
            margin-bottom: 10px;
          }
        }
      }
      .item:hover{
        i{
          color: #b0b0b0;
        }
      }
      .item-on{
        cursor:pointer;
        border: 1px solid #e0e0e0;
        display: flex;
        height: 180px;
        padding:20px;
        position: relative;
        .address-info{
          width: 100%;
          font-size: 14px;
          color: #757575;
          .name{
            font-size: 18px;
            margin-bottom: 20px;
            span{
              color: $font-color-main;
              float: right;
              font-size: 12px;
            }
          }
          .address-action{
            position: absolute;
            bottom: 20px;
            right: 20px;
            display: none;
          }
        }
      }
      .item-on:hover{
        .address-action{
          display: block;
        }
      }
      .item-on.on{
        border: 1px solid $font-color-main;
      }
    }
  }
</style>

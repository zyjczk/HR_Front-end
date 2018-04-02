import axios from '@/api/api'
export default {
  data () {
    return {
      selectVal: '',
      bonusMonth: '',
      administrators: '',
      lisTtitle: [
        {
          title: '机构名称',
          key: 'orgName',
          render: (h, params) => {
            return h(
              'a',
              {
                on: {
                  click: () => {
                    this.tableClick(params.row.mainId)
                  }
                }
              },
              params.row.orgName
            )
          }
        },
        {
          title: '负责人工号',
          key: 'operatorCode'
        },
        {
          title: '负责人名称',
          key: 'operatorName'
        },
        {
          title: '奖金（元）',
          key: 'amount'
        }
        // {
        //   title: '操作',
        //   render: (h, params) => {
        //     return h(
        //       'Button',
        //       {
        //         on: {
        //           click: () => {
        //             this.tableRowDown(params.row.mainId)
        //           }
        //         },
        //         attrs: {
        //           type: 'primary'
        //         }
        //       },
        //       '下载'
        //     )
        //   }
        // }
      ],
      listData: [],
      cityList: [
        {
          value: '0105',
          label: '全部'
        },
        {
          value: '010501',
          label: '安徽省'
        },
        {
          value: '010502',
          label: '北京市'
        },
        {
          value: '010503',
          label: '福建省'
        },
        {
          value: '010504',
          label: '广东省'
        },
        {
          value: '010505',
          label: '广西省'
        },
        {
          value: '010506',
          label: '贵州省'
        },
        {
          value: '010507',
          label: '河北省'
        },
        {
          value: '010508',
          label: '河南省'
        },
        {
          value: '010509',
          label: '湖北省'
        },
        {
          value: '010510',
          label: '湖南省'
        },
        {
          value: '010511',
          label: '吉林省'
        },
        {
          value: '010512',
          label: '辽宁省'
        },
        {
          value: '010513',
          label: '内蒙省'
        },
        {
          value: '010514',
          label: '山东省'
        },
        {
          value: '010515',
          label: '山西省'
        },
        {
          value: '010516',
          label: '陕西省'
        },
        {
          value: '010517',
          label: '上海省'
        },
        {
          value: '010518',
          label: '四川省'
        },
        {
          value: '010519',
          label: '天津省'
        },
        {
          value: '010520',
          label: '云南省'
        },
        {
          value: '010521',
          label: '浙江省'
        },
        {
          value: '010522',
          label: '重庆省'
        },
        {
          value: '010523',
          label: '江苏省'
        },
        {
          value: '010524',
          label: '江西省'
        }
      ],
      cityCode: '0105',
      minMoney: 999999999,
      total: 0,
      current: 1
    }
  },
  methods: {
    // changePage () {
    //   console.log(222)
    // },
    tableClick (id) {
      this.$router.push('/salary/salarySearch/searchDetail/' + id)
    },
    tableRowDown (id) {
      if (id && this.bonusMonth) {
        window.open('/kyBonus/approved/exportDetail?bonusMonth=' + this.formatMonthTime + '&orgCode=' + id)
      } else {
        this.$Message.error('请选择月份及省份后下载')
      }
    },
    error (msg) {
      this.$Message.error(msg)
    },
    getSalaryList (page) {
      this.current = page
      if (!this.bonusMonth) {
        this.error('请输入要查询的月份')
        return
      }
      axios({
        url:
          '/kyBonus/approved/queryBonus?type=' +
          this.administrators +
          '&bonusMonth=' +
          this.formatMonthTime + '&pageNum=' + page,
        methods: 'get'
      }).then(res => {
        if (res.data.status === 200) {
          res.data.data.forEach((v, k) => {
            let money = parseFloat(v.amount)
            if (money !== 0 && money < this.minMoney) {
              this.minMoney = money
            }
          })
          // res.data.data.forEach((v, k) => {
          //   if (v.amount >= (this.minMoney * 3)) {
          //     v.cellClassName = {
          //       amount: 'table-cell-amount '
          //     }
          //   }
          // })
          this.listData = res.data.data
          this.total = res.data.totalItemsCount
        } else {
          this.$Message.error(res.data.message)
        }
      })
    }
  },
  mounted () {
    this.administrators = (+localStorage.type)
  },
  computed: {
    formatMonthTime () {
      let time = new Date(this.bonusMonth)
      let month = time.getMonth() + 1
      let year = time.getFullYear()
      if (month < 10) {
        month = '0' + '' + month
      }
      return year + '-' + month
    }
  }
}

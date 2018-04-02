import axios from '@/api/api'

export default {
  data () {
    return {
      lisTtitle: [
        {
          title: '网点名称',
          key: 'orgName'
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
      ],
      listTitleStaff: [
        {
          title: '工号',
          key: 'operatorCode'
        },
        {
          title: '姓名',
          key: 'operatorName'
        },
        {
          title: '奖金（元）',
          key: 'amount'
        }
      ],
      listData: [],
      modal1: false,
      administrators: '',
      bonusMonth: '',
      orgName: '',
      amount: '',
      approvedTime: '',
      text: '',
      loading: true,
      minMoney: 9999999999999,
      sum: 0
    }
  },
  methods: {
    showAuth (str) {
      if (localStorage.auth.indexOf(str) !== -1) {
        return true
      } else {
        return false
      }
    },
    getStaffAuditList () {
      axios({
        url:
          '/kyBonus/approved/queryBonusDetail?mainId=' + this.$route.params.id,
        methods: 'get'
      }).then(res => {
        if (res.data.data && res.data.data.length > 0) {
          res.data.data.forEach((v, k) => {
            let money = parseFloat(v.amount)
            if (money !== 0 && money < this.minMoney) {
              this.minMoney = money
            }
            this.sum += money
          })
        }
        if (this.administrators !== 1) {
          res.data.data.forEach((v, k) => {
            if (v.amount >= (this.minMoney * 3)) {
              v.cellClassName = {
                amount: 'table-cell-amount'
              }
            }
          })
        }
        if (this.administrators === 1) {
          res.data.data.push({
            orgCode: '000',
            orgName: '总计',
            operatorCode: '--',
            operatorName: '--',
            amount: Math.round(parseFloat(this.sum) * 100) / 100
          })
        } else {
          res.data.data.push({
            operatorCode: '总计',
            operatorName: '--',
            amount: Math.round(parseFloat(this.sum) * 100) / 100
          })
        }
        this.bonusMonth = res.data.bonusMonth
        this.orgName = res.data.orgName
        this.amount = res.data.amount
        this.approvedTime = res.data.approvedTime
        this.listData = res.data.data
      })
    },
    successMsg (msg) {
      this.$Message.success(msg)
    },
    errorMsg (msg) {
      this.$Message.error(msg)
    },
    ok () {
      if (!this.text) {
        this.$Message.error('请输入驳回说明')
        setTimeout(() => {
          this.loading = false
          this.$nextTick(() => {
            this.loading = true
          })
        }, 500)
        return
      }
      this.passed(3, this.text)
    },
    passed (type, text) {
      axios({
        url: '/kyBonus/approved/approvedBonus',
        method: 'post',
        data: {
          type: this.administrators,
          mainId: this.$route.params.id,
          bonusMonth: this.bonusMonth,
          approvedStatus: type,
          approvedRemarks: text,
          details: this.listData
        }
      }).then(res => {
        if (res.data === 'success') {
          this.modal1 = false
          this.successMsg('审核通过')
          this.$router.go(-1)
        } else {
          this.errorMsg(res.data)
          setTimeout(() => {
            this.loading = false
            this.$nextTick(() => {
              this.loading = true
            })
          }, 500)
        }
      })
    }
    // rowClassName (row, index) {
    //   if (this.administrators === 1) {
    //     if (
    //       row.orgName !== '总计' &&
    //       this.minMoney !== 0 &&
    //       row.amount >= parseInt(this.minMoney) * 3
    //     ) {
    //       return 'money-primary'
    //     } else {
    //       return ''
    //     }
    //   } else {
    //     if (
    //       row.operatorCode !== '总计' &&
    //       this.minMoney !== 0 &&
    //       row.amount >= parseInt(this.minMoney) * 3
    //     ) {
    //       return 'money-primary'
    //     } else {
    //       return ''
    //     }
    //   }
    // }
  },
  mounted () {
    this.administrators = (+localStorage.type)
    this.getStaffAuditList()
  }
}

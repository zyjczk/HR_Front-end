import { auditStatus } from '@/config/filter'
import axios from '@/api/api'

export default {
  data () {
    return {
      lisTtitle: [
        {
          title: '提交时间',
          key: 'entryTime'
        },
        {
          title: '工号',
          key: 'operatorCode'
        },
        {
          title: '提交人',
          key: 'operatorName'
        },
        {
          title: '职位',
          key: 'name'
        },
        {
          title: '奖励月份',
          key: 'bonusMonth'
        },
        {
          title: '审核状态',
          render: (h, params) => {
            return h('span', auditStatus[params.row.approvedStatus])
          }
        },
        {
          title: '操作',
          render: (h, params) => {
            let content
            if (params.row.approvedStatus === 1) {
              content = h(
                'a',
                {
                  on: {
                    click: () => {
                      this.tableClick('审核', params.row.mainId)
                    }
                  }
                },
                '审核'
              )
            } else {
              content = h(
                'a',
                {
                  on: {
                    click: () => {
                      this.tableClick('查看详情', params.row.mainId)
                    }
                  }
                },
                '查看详情'
              )
            }
            return content
          }
        }
      ],
      listData: [],
      administrators: false
    }
  },
  methods: {
    getStaffAuditList () {
      // debugger
      axios({
        url: '/kyBonus/approved/queryApproved?type=' + this.administrators,
        methods: 'get'
      }).then(res => {
        this.listData = res.data.data
      })
    },
    tableClick (str, id) {
      if (str === '审核') {
        this.$router.push({
          path: '/salary/salaryReview/salaryReviewDetail/' + id
        })
      } else {
        this.$router.push({
          path: '/salary/salaryReview/salaryCheckDetail/' + id
        })
      }
    }
  },
  mounted () {
    this.administrators = (+localStorage.type)
    this.getStaffAuditList()
  }
}

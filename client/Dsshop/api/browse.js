import Network from '../utils/network.js'
export default {
    getList(data,success,fail) {
		Network.setGetMessage('browse',data,'', function (res) {
		  success(res)
		}, function (res) {
		})
    },
	create(data,success,fail) {
		Network.setPostMessage('browse',data,'', function (res) {
		  success(res)
		}, function (res) {
		})
	}
};
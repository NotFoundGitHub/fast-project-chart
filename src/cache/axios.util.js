import axios from 'axios';
import vue from 'vue';

let that = vue.prototype;
axios.interceptors.request.use(
    function (config) {
        config.data = config.data || {};
        config.params = config.params || {};

        if (!config.notShowLoading) {
            that.$Spin.show();
        }

        return config;
    },
    function (error) {
        that.$Spin.hide();
        if (!error.config.hideError) {
            that.$Message.error({
                content: '网络异常，请稍后重试',
                background: true
            })
        }
        Promise.reject(error);
    }
);

axios.interceptors.response.use(
    function (response) {
        let err;
        let result = response.data.result;
        let errorCode = response.data.code;
        let errorMessage = response.data.message;
        console.log('that', that)
        that.$Spin.hide();

        if (errorCode !== 0) {
            if (!response.config.hideError) {
                switch (errorCode) {
                    case -3: // toast显示
                    that.$Message.error({
                        content: errorMessage,
                        background: true
                    })
                        break;
                    case -2: // 弹窗显示,多按钮
                    that.$Modal.error({
                            title: '提示',
                            content: errorMessage,
                            okButton: '知道了'
                        });
                        break;
                    case -1: // 不处理
                        err = new Error(errorMessage);
                        err.code = errorCode;
                        return Promise.reject(err);
                    case 1: // 未登录
                        err = new Error(errorMessage);
                        err.code = errorCode;
                        that.$Message.error({
                            content: '未登录',
                            background: true
                        })
                        return Promise.reject(err);
                    case 2: // 没权限
                    that.$Message.error({
                        content: '无权限',
                        background: true
                    })
                        window.location.href = '/#/404';
                        break;
                    default:
                        // 其他
                        that.$Message.error({
                            content: '网络异常，请稍后重试',
                            background: true
                        })
                        break;
                }
                // 使pending，这样就不会走到resolve或者rejcet的逻辑了
                return new Promise(() => {});
            } else {
                Promise.reject(result);
            }
        } else {
            return response.config.filter ? response.config.filter(result) : result;
        }
    },
    function (error) {
        that.$Spin.hide();
        if (!error.config.hideError) {
            that.$Message.error({
                content: '网络异常，请稍后重试',
                background: true
            })
        }
        Promise.reject(error);
    }
);

export default axios;

const basePath = 'https://wxapi.joinmap.ai/api';
const urlList = {
  login: basePath + '/user/thirdPart/login/xcx',// 小程序登录
  upload: basePath + '/view/project/upload',// 上传 
  register: basePath + '/user/thirdPart/register',// 小程序注册
  reglogin: basePath + '/user/thirdPart/reglogin',// 小程序注册登录 
  userLogin: basePath + '/user/login',// 用户名密码登录
  userViewList: basePath + '/view/view/get/user',// 用户视图列表
  userView: basePath + '/view/graph/re/query',// 用户视图
  viewData: basePath + '/view/project/file/list',// 关联数据
}
module.exports = urlList;

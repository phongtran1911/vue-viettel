export const urlApi = {
    baseUrl: 'https://api.wms.nhllogistics.vn/',
    customer: {
        getList: 'web/users?token=',
    },
    category: {
        getList: 'web/categories?token='
    },
    productgroup: {
        getListbyCatID: 'web/groupsbycat/',
        postCreateGroup: 'web/group?token=',
        putUpdateGroup: 'web/group?token=',
        getProductGroupbyID: 'web/groups/'
    },
    product: {
        getListbyGroupID: 'web/productsbygroup/',
        getProductbyID: 'web/products/',
        postCreatProduct: 'web/product?token=',
        putUpdateProduct: 'web/product?token='
    }
}
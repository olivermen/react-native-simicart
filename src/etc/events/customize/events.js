export default {
    menu_left_items: [
        {
            active: true,
            key: 'item_brand',
            route_name: "BrandPage",
            label: "Brand",
            is_extend: false,
            is_separator: false,
            position: 350,
            image: require('../../../customize/icon/background.png')
        },
    ],
    menu_left_disable_items: [

    ],

    footer_app: [
        // {
        //     active: true,
        //     content: require('../../../customize/whatsapp').default,
        // }
        {
            active: true,
            content: require('../../../customize/footer/BottomMenu').default,
            position: 1
        }
    ]

    // network_get_params: [
    //     {
    //         key : 'cache',
    //         value: require('../../../customize/addprams/index')
    //     }
    // ],
}

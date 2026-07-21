// import { override, useBabelRc } from "customize-cra";

// module.exports = override(
//     // eslint-disable-next-line react-hooks/rules-of-hooks
//     useBabelRc()
// );

// ======
// config-overrides.js
// import { override, addWebpackModuleRule } from 'customize-cra';

// module.exports = override(
//   // Thêm các rule bạn đang dùng ở đây
//   // Ví dụ:
//   // addWebpackModuleRule({
//   //   test: /\.scss$/,
//   //   use: ['style-loader', 'css-loader', 'sass-loader']
//   // })
// );

// config-overrides.js
const { override, addBabelPlugin } = require('customize-cra');

module.exports = override(
    addBabelPlugin([
        'module-resolver',
        {
            root: ['./src'],
            alias: {
                '~': './src',
            },
        },
    ]),
);

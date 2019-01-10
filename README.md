# react-formik

react and formik exercise

react formik yup json-shema-to-yup typescript

## 功能介绍
- 实践json-schema-to-yup
- 实践formik + yup
- 创建项目
    - 动态创建表单元素
    - 场景
        - 上侧：json数据输入
        - 左侧：动态创建表单schema，从无到有
        - 右侧：表单根据左侧schema实时变化，动态生成


### 2019.1.2
- 实践json-shcema-to-yup 有点问题
- 页面设计：左侧上方jsonSchema树状图，左侧下方是生成的实时jsonSchema数据; 右侧是根据jsonSchema生成的动态表单。如果需要动态json数据生成，则放在最上侧。


### 2019.1.6
- formik + yup + antd 实践登录/注册/更复杂表单
- 重点实践：
    1. Formik
    2. withFormik()
    3. Field
    4. FieldArray
    5. Form
    6. ErrorMessage
    7. connect()
    8. FastField
- 思考：
    1. 如何使用jsonSchema?
    2. 先猜测或想，如果是自己实现这么一个功能，要怎么做？写一些代码验证一下。
    3. 读源码，看看大神怎么来的。最好是按发布版本（最初）怎么样？


### 2019.1.7
    1. 实践antd 登录表单
    2. 将上述表单在不改变样式情况下转成formik组建
    3. 加入error信息判断
    4. 加一些其他事件
> 完成

### 2019.1.9
    1. 思考如何创建动态表单？
    > 依然需要json数据及其对应的jsonSchema。而且得封装自己的表单组件库。不同数据类型有自己的组件。所以用这两个库来解决动态表单创建和原来相比，没有什么先进性。
    2. 实践一下<Field /> name render children component innerRef validate 

### 2019.1.10
    1. withFormik()
    2. <Form /> 类似于 <form onReset={formikProps.handleReset} onSubmit={formikProps.handleSubmit} >{...props} />
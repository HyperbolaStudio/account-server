# 一些通用约定

- 所有通用API都在`/api`目录下。

- 所有API的响应都包括：

    |键|类型|描述|
    |-|-|-|
    |status|`string`|请求的处理结果，约定用`'Success'`表示处理成功，用`'Unexpected Error'表示意料之外的错误`|

- API请求和响应都使用application/json，用POST方法传递。

# 注册API

源文件：[/api/register.ts](/api/register.ts)

路径： `/api/register`

请求：

|键|类型|限定|描述|
|-|-|-|-|
|username|`string`|`^\w+$`|用户名|
|passwordSHA256|`string`|`^([0-9]|[a-f]){64}$`|密码的SHA256|
|inviteCode|`string`|`^([0-9]|[a-f]){16}$`|注册邀请码|
|nickname|`string? = username`|`^(\w|[\u0080-\uffff]|[\u0020])+$`|昵称，默认值为用户名|
|gender|`string?`||性别|
|birthdate|`number[3]?`||生日，`[0]`为年份（4位），`[1]`为月，`[2]`为月|

响应：

|键|类型|描述|
|-|-|-|
|status|`'Success'|'Invalid'|'User Already Registered'|'Unexpected Error'`|注册的处理状态，取值分别表示注册成功，请求不合法，用户已注册（用户名重复），意料之外的错误|
|userID|`number`|用户编号（若注册失败，则值为`-1`）|

处理与存储：

- 邀请码会进行校验，若邀请码不存在，则响应中的`status`值为`'Invalid'`，否则删除该条邀请码记录。

- 用户名，密码的SHA256，昵称会被直接存储，性别会被转换为一个整数：

    |性别字符串|性别整数值|
    |-|-|
    |`undefined`|`1`|
    |`'male'`|`2`|
    |`'female'`|`3`|
    |其他|`0`|

- 生日会被转换为一个Date。

# 登录API

源文件：[/api/login.ts](/api/login.ts)

路径：`/api/login`

请求：

|键|类型|限定|描述|
|-|-|-|-|
|loginName|`string|number`|当为`string`时，`^\w+$`|登录名，可为用户名或者用户编号|
|loginType|`number`||规定了登录名的类型，`1`为用户名，`2`为用户编号|
|passwordSHA256|`string`|`^([0-9]|[a-f]){64}$`|密码的SHA256|

响应：

|键|类型|描述|
|-|-|-|
|status|`'Success'|'Failed'|'User Not Found'|'Invalid'|'Unexpected Error'|`|登录的处理状态，分别表示登录成功，登录失败，用户不存在，请求不合法，意料之外的错误|
|sessionID|`string`|会话标识符，若登录失败，则为空字符串|

处理与存储：

- 在用户表中查询用户名或者用户编号，比较密码的SHA256是否一致。

- 生成一个唯一的会话标识符，映射到该用户编号。

# 关注API

源文件：[/api/follow.ts](/api/follow.ts)

## 关注与取消关注

路径：`/api/follow`（关注），`/api/unfollow`（取消关注）

请求：

|键|类型|描述|
|-|-|-|
|targetID|`number`|关注或取消关注对象的用户编号|

响应：

|键|类型|描述|
|-|-|-|
|status|`'Success'|'Invalid'|'Target User Not Exist'|'Not Logged In'|'Unexpected Error'`|关注或取消关注的处理状态，分别表示成功，请求不合法，目标用户不存在，会话未登录，意料之外的错误|

处理与存储：

- 目标用户与当前会话用户相同的请求会被判断为不合法。

- 会在关注表中插入一条新的记录来存储关注信息。

## 查询关注/粉丝数量

路径：`/api/follow/amount/following`（关注），`/api/follow/amount/followed`（粉丝）

请求：无

响应：

|键|类型|描述|
|-|-|-|
|status|`'Success'|'Not Logged In'|'Unexpected Error'`|查询的处理状态，分别表示查询成功，会话未登录，意料之外的错误|
|amount|`number`|查询到的数量，查询失败则为`-1`|

## 查询关注/粉丝列表

路径：`/api/follow/list/following`（关注），`/api/follow/list/followed`（粉丝）

请求：

|键|类型|描述|
|-|-|-|
|offset|`number`|查询开始位置的偏移|
|amount|`number`|查询的数量|

响应：

|键|类型|描述|
|-|-|-|
|status|`'Success'|'Not Logged In'|'Unexpected Error'`|查询的处理状态，分别表示查询成功，会话未登录，意料之外的错误|
|list|`number[]`|查询到的列表，查询失败则为空数组|

处理与存储：

- 查询时会使用limit来控制查询数量，不宜一次查询过多，应当分页。
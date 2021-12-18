
enum a{
    a = "a",
    b = "b"
}
const aaa:a = a.a;

export const libString = `





declare module 'moyu'{


    export interface Member{
        // 微信号
        wxid:string,
        // 昵称
        nickname:string,
        // 备注名
        remark:string,
        //头像
        avatar:string,
    }

    export interface IChatroom  {
        // 群聊 wxid
        wxid: string;
        // 名称
        name: string;
        // 头像
        avatar?: string;
        // 群主id
        manager_wxid?: string;
        // 成员
        member_list: Member[];
    }


    export type MessageInfoType = "text" | "picture" | "emoji";

    /**
     * 创建Plugin Instance的参数
     */
    export interface CreateProps {
    /**
     * 小助手 wxid
     */
    self_wxid: string;
    /**
     * 群聊id
     */
    room_wxid: string;
    /**
     * 配置
     */
    config: string;

    /**
     * 获得房间详情
     */
    getRoomInfo(): Promise<IChatroom | null | undefined>;

    /**
     * 发送文本
     */
    sendText(content: string): void;
    /**
     * 发送 @ 消息
     */
    sendMentionText(content: string, at_list: string[]): void;
    /**
     * 发送图片
     */
    sendPicture(filePath: string): void;
    /**
     * 发送文件
     */
    sendFile(filePath: string): void;

    /**
     * 注册定时任务
     * @param key
     * @param rule cron
     */
    registerSchedule(key: string, rule: string): void;
    }
    /**
     * 传入给Plugin的信息
     */
    export interface MessageInfo {
        /**
         * 消息类型
         */
        type: MessageInfoType;
        /**
         * 是否 @ 了自己
         */
        mentionSelf: boolean;
        /**
         * @ 列表
         */
        mention_list: string[];
        /**
         * 消息内容
         */
        text: string;
        /**
         * 原始内容
         */
        raw: string;
        /**
         * 获得发送人
         */
        getSenderInfo(): Promise<Member | null | undefined>;
        /**
         * 保存图片到路径
         */
        savePicture(): Promise<string>;
    }

    export interface PluginInstance {
        /**
         * 触发定时任务
         * @param key 
         */
        onScheduled(key:string):any
        /**
         * 获得消息
         * @param msg 
         */
        onMessage(msg:MessageInfo):any
        /**
         * 释放
         */
        dispose():void
      }

      export type CreatePluginInstanceFunc = (props:CreateProps) => PluginInstance
}





`
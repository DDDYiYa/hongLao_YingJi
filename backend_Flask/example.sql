/*
 Navicat Premium Data Transfer

 Source Server         : LocalMysql
 Source Server Type    : MySQL
 Source Server Version : 80022
 Source Host           : localhost:3306
 Source Schema         : example

 Target Server Type    : MySQL
 Target Server Version : 80022
 File Encoding         : 65001

 Date: 28/03/2022 19:16:11
*/

SET NAMES utf8;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for admin_table
-- ----------------------------
DROP TABLE IF EXISTS `admin_table`;
CREATE TABLE `admin_table`  (
  `admin_id` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '???id',
  `admin_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '?????',
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '?????',
  `admin_permission` int(0) NULL DEFAULT NULL COMMENT '??????0:???5???',
  `continous_fail_times` int(0) NOT NULL,
  `last_fail_time` datetime(0) NULL DEFAULT NULL,
  PRIMARY KEY (`admin_id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of admin_table
-- ----------------------------
INSERT INTO `admin_table` VALUES ('gac', 'GAC', '123456', 99, 0, NULL);
INSERT INTO `admin_table` VALUES ('gac00', 'GAC', '123456', 10, 0, NULL);
INSERT INTO `admin_table` VALUES ('gac01', 'GAC', '123456', 10, 0, NULL);
INSERT INTO `admin_table` VALUES ('gac02', 'GAC', '123456', 10, 0, NULL);
INSERT INTO `admin_table` VALUES ('gac_00', 'GAC', '123456', 0, 0, NULL);

-- ----------------------------
-- Table structure for setting
-- ----------------------------
DROP TABLE IF EXISTS `setting`;
CREATE TABLE `setting`  (
  `id` int(0) NOT NULL,
  `setting_item_1` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `continous_fail_times_limit` int(0) NULL DEFAULT NULL,
  `fail_cool_down_time` int(0) NOT NULL COMMENT '登录失败冷却时间',
  `session_keep_time` int(0) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of setting
-- ----------------------------
INSERT INTO `setting` VALUES (1, 'aa', 5, 30, 10);

-- ----------------------------
-- Table structure for sys_oper_log
-- ----------------------------
DROP TABLE IF EXISTS `sys_oper_log`;
CREATE TABLE `sys_oper_log`  (
  `id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `oper_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `oper_ip` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `oper_param` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `user_id` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `oper_time` datetime(0) NULL DEFAULT NULL,
  `remarks` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sys_oper_log
-- ----------------------------
INSERT INTO `sys_oper_log` VALUES ('00a14bd7-ae80-11ec-ac72-f8ac65e53322', '/manage/test_permission_required', '127.0.0.1', NULL, 'gac00', '2022-03-28 18:15:33', NULL);
INSERT INTO `sys_oper_log` VALUES ('03216ec7-ae88-11ec-a2b7-f8ac65e53322', '/auth/login', '127.0.0.1', NULL, 'gac00', '2022-03-28 19:12:53', 'login success');
INSERT INTO `sys_oper_log` VALUES ('0474ec52-ae88-11ec-be5d-f8ac65e53322', '/manage/test_permission_required', '127.0.0.1', NULL, 'gac00', '2022-03-28 19:12:56', NULL);
INSERT INTO `sys_oper_log` VALUES ('06c81f0c-ae80-11ec-bedb-f8ac65e53322', '/manage/test_permission_required', '127.0.0.1', NULL, 'gac00', '2022-03-28 18:15:43', 'beyond session keep time');
INSERT INTO `sys_oper_log` VALUES ('08342d40-ae80-11ec-bfbc-f8ac65e53322', '/manage/test_permission_required', '127.0.0.1', NULL, 'gac00', '2022-03-28 18:15:46', 'beyond session keep time');
INSERT INTO `sys_oper_log` VALUES ('09fc5c40-ae80-11ec-bfda-f8ac65e53322', '/auth/login', '127.0.0.1', NULL, 'gac00', '2022-03-28 18:15:49', 'login success');
INSERT INTO `sys_oper_log` VALUES ('0a2ae6ec-ae88-11ec-b515-f8ac65e53322', '/manage/test_permission_required', '127.0.0.1', NULL, 'gac00', '2022-03-28 19:13:05', 'beyond session keep time');
INSERT INTO `sys_oper_log` VALUES ('0b567bba-ae80-11ec-836c-f8ac65e53322', '/manage/test_permission_required', '127.0.0.1', NULL, 'gac00', '2022-03-28 18:15:51', NULL);
INSERT INTO `sys_oper_log` VALUES ('0b68de98-ae88-11ec-97e6-f8ac65e53322', '/manage/test_permission_required', '127.0.0.1', NULL, 'gac00', '2022-03-28 19:13:07', 'beyond session keep time');
INSERT INTO `sys_oper_log` VALUES ('1afc78d6-ae86-11ec-8a30-f8ac65e53322', '/manage/test_permission_required', '127.0.0.1', NULL, NULL, '2022-03-28 18:59:14', 'not found the given id');
INSERT INTO `sys_oper_log` VALUES ('1da1bd89-ae81-11ec-9091-f8ac65e53322', '/manage/test_permission_required', '127.0.0.1', NULL, NULL, '2022-03-28 18:23:31', 'not found the given id');
INSERT INTO `sys_oper_log` VALUES ('1df4738e-ae86-11ec-8fb7-f8ac65e53322', '/manage/test_permission_required', '127.0.0.1', NULL, NULL, '2022-03-28 18:59:19', NULL);
INSERT INTO `sys_oper_log` VALUES ('20aa2871-3df9-11ec-a062-f8ac65e53322', '/auth/logout', '127.0.0.1', NULL, 'gac00', '2021-11-05 13:27:56', NULL);
INSERT INTO `sys_oper_log` VALUES ('301ad1be-ae81-11ec-b3ad-f8ac65e53322', '/manage/test_permission_required', '127.0.0.1', NULL, NULL, '2022-03-28 18:24:02', 'not found the given id');
INSERT INTO `sys_oper_log` VALUES ('30228487-3df9-11ec-8a1a-f8ac65e53322', '/auth/login', '127.0.0.1', NULL, 'gac00', '2021-11-05 13:28:21', NULL);
INSERT INTO `sys_oper_log` VALUES ('324e5d65-ae81-11ec-88d5-f8ac65e53322', '/manage/test_permission_required', '127.0.0.1', NULL, NULL, '2022-03-28 18:24:06', NULL);
INSERT INTO `sys_oper_log` VALUES ('3409ff5c-ae86-11ec-8cf3-f8ac65e53322', '/manage/test_permission_required', '127.0.0.1', NULL, NULL, '2022-03-28 18:59:56', 'not found the given id');
INSERT INTO `sys_oper_log` VALUES ('363a4f4c-ae86-11ec-8aad-f8ac65e53322', '/manage/test_permission_required', '127.0.0.1', NULL, NULL, '2022-03-28 19:00:00', 'excp:');
INSERT INTO `sys_oper_log` VALUES ('3c5c4f98-ae76-11ec-ba0e-f8ac65e53322', '/auth/login', '127.0.0.1', NULL, 'gac00', '2022-03-28 17:05:38', NULL);
INSERT INTO `sys_oper_log` VALUES ('3d42ae0d-ae7b-11ec-8148-f8ac65e53322', '/auth/login', '127.0.0.1', NULL, 'gac00', '2022-03-28 17:41:28', NULL);
INSERT INTO `sys_oper_log` VALUES ('4b2e84bf-3012-11ec-b6e2-f8ac65e53322', '/auth/login', '127.0.0.1', NULL, 'gac', '2021-10-18 20:52:48', NULL);
INSERT INTO `sys_oper_log` VALUES ('4c23d1f0-ae87-11ec-b7cf-f8ac65e53322', '/manage/test_permission_required', '127.0.0.1', NULL, NULL, '2022-03-28 19:07:46', 'not found the given id');
INSERT INTO `sys_oper_log` VALUES ('4df4d15c-ae87-11ec-ba93-f8ac65e53322', '/manage/test_permission_required', '127.0.0.1', NULL, NULL, '2022-03-28 19:07:49', 'not found the given id');
INSERT INTO `sys_oper_log` VALUES ('4e8650c6-ae87-11ec-bede-f8ac65e53322', '/manage/test_permission_required', '127.0.0.1', NULL, NULL, '2022-03-28 19:07:50', 'not found the given id');
INSERT INTO `sys_oper_log` VALUES ('510a223b-3012-11ec-9518-f8ac65e53322', '/auth/login', '127.0.0.1', NULL, 'gac', '2021-10-18 20:52:57', NULL);
INSERT INTO `sys_oper_log` VALUES ('52acc6b2-3012-11ec-b968-f8ac65e53322', '/auth/login', '127.0.0.1', NULL, 'gac', '2021-10-18 20:53:00', NULL);
INSERT INTO `sys_oper_log` VALUES ('5304615a-3012-11ec-8a2e-f8ac65e53322', '/auth/login', '127.0.0.1', NULL, 'gac', '2021-10-18 20:53:00', NULL);
INSERT INTO `sys_oper_log` VALUES ('53583915-3012-11ec-b4c8-f8ac65e53322', '/auth/login', '127.0.0.1', NULL, 'gac', '2021-10-18 20:53:01', NULL);
INSERT INTO `sys_oper_log` VALUES ('53950ace-3012-11ec-bac4-f8ac65e53322', '/auth/login', '127.0.0.1', NULL, 'gac', '2021-10-18 20:53:01', NULL);
INSERT INTO `sys_oper_log` VALUES ('53ca246d-3012-11ec-8df4-f8ac65e53322', '/auth/login', '127.0.0.1', NULL, 'gac', '2021-10-18 20:53:01', NULL);
INSERT INTO `sys_oper_log` VALUES ('55045ead-ae88-11ec-95c4-f8ac65e53322', '/auth/login', '127.0.0.1', NULL, 'gac00', '2022-03-28 19:15:11', 'login success');
INSERT INTO `sys_oper_log` VALUES ('567c899f-ae88-11ec-a24f-f8ac65e53322', '/manage/test_permission_required', '127.0.0.1', NULL, 'gac00', '2022-03-28 19:15:13', NULL);
INSERT INTO `sys_oper_log` VALUES ('58ed7433-ae7a-11ec-a52e-f8ac65e53322', '/auth/login', '127.0.0.1', NULL, 'gac00', '2022-03-28 17:35:04', NULL);
INSERT INTO `sys_oper_log` VALUES ('59d4e50f-ae87-11ec-8815-f8ac65e53322', '/manage/test_permission_required', '127.0.0.1', NULL, 'gac00', '2022-03-28 19:08:09', 'beyond session keep time');
INSERT INTO `sys_oper_log` VALUES ('5bd71085-ae87-11ec-9732-f8ac65e53322', '/manage/test_permission_required', '127.0.0.1', NULL, 'gac00', '2022-03-28 19:08:13', 'beyond session keep time');
INSERT INTO `sys_oper_log` VALUES ('5d2ca325-ae87-11ec-a7ac-f8ac65e53322', '/auth/login', '127.0.0.1', NULL, 'gac00', '2022-03-28 19:08:15', 'login success');
INSERT INTO `sys_oper_log` VALUES ('5ee8360c-ae87-11ec-8bb5-f8ac65e53322', '/manage/test_permission_required', '127.0.0.1', NULL, 'gac00', '2022-03-28 19:08:18', NULL);
INSERT INTO `sys_oper_log` VALUES ('60bf0c3e-ae87-11ec-bdad-f8ac65e53322', '/manage/test_permission_required', '127.0.0.1', NULL, 'gac00', '2022-03-28 19:08:21', NULL);
INSERT INTO `sys_oper_log` VALUES ('68a559fe-ae87-11ec-92e7-f8ac65e53322', '/auth/login', '127.0.0.1', NULL, 'gac', '2022-03-28 19:08:34', 'login success');
INSERT INTO `sys_oper_log` VALUES ('68dad75f-3012-11ec-a7e1-f8ac65e53322', '/auth/login', '127.0.0.1', NULL, 'gac00', '2021-10-18 20:43:37', NULL);
INSERT INTO `sys_oper_log` VALUES ('6a371f6f-3df9-11ec-8352-f8ac65e53322', '/auth/login', '127.0.0.1', NULL, 'gac00', '2021-11-05 13:29:58', NULL);
INSERT INTO `sys_oper_log` VALUES ('6a76014b-ae87-11ec-ad51-f8ac65e53322', '/manage/test_permission_required', '127.0.0.1', NULL, 'gac', '2022-03-28 19:08:37', NULL);
INSERT INTO `sys_oper_log` VALUES ('6b45adea-ae87-11ec-b6ef-f8ac65e53322', '/manage/test_permission_required', '127.0.0.1', NULL, 'gac', '2022-03-28 19:08:39', NULL);
INSERT INTO `sys_oper_log` VALUES ('6bebd56e-ae87-11ec-b157-f8ac65e53322', '/manage/test_permission_required', '127.0.0.1', NULL, 'gac', '2022-03-28 19:08:40', NULL);
INSERT INTO `sys_oper_log` VALUES ('6c95c09e-ae87-11ec-9d61-f8ac65e53322', '/manage/test_permission_required', '127.0.0.1', NULL, 'gac', '2022-03-28 19:08:41', NULL);
INSERT INTO `sys_oper_log` VALUES ('6d1d9df2-ae87-11ec-abc5-f8ac65e53322', '/manage/test_permission_required', '127.0.0.1', NULL, 'gac', '2022-03-28 19:08:42', NULL);
INSERT INTO `sys_oper_log` VALUES ('6e12e884-ae7a-11ec-a016-f8ac65e53322', '/auth/login', '127.0.0.1', NULL, 'gac00', '2022-03-28 17:35:40', NULL);
INSERT INTO `sys_oper_log` VALUES ('745f497b-ae87-11ec-9b74-f8ac65e53322', '/auth/login', '127.0.0.1', NULL, 'gac', '2022-03-28 19:08:54', 'login success');
INSERT INTO `sys_oper_log` VALUES ('7683596f-ae86-11ec-a635-f8ac65e53322', '/manage/test_permission_required', '127.0.0.1', NULL, NULL, '2022-03-28 19:01:48', 'not found the given id');
INSERT INTO `sys_oper_log` VALUES ('882fea45-ae87-11ec-98d6-f8ac65e53322', '/manage/test_permission_required', '127.0.0.1', NULL, 'gac', '2022-03-28 19:09:27', 'beyond session keep time');
INSERT INTO `sys_oper_log` VALUES ('8832a6df-ae7d-11ec-b68e-f8ac65e53322', '/auth/login', '127.0.0.1', NULL, 'gac00', '2022-03-28 17:57:52', 'login success');
INSERT INTO `sys_oper_log` VALUES ('8a2bb842-ae7d-11ec-8989-f8ac65e53322', '/auth/login', '127.0.0.1', NULL, 'gac00', '2022-03-28 17:57:55', 'login success');
INSERT INTO `sys_oper_log` VALUES ('8f071390-3dfe-11ec-bfe3-f8ac65e53322', '/auth/login', '127.0.0.1', NULL, 'gac', '2021-11-05 14:06:47', NULL);
INSERT INTO `sys_oper_log` VALUES ('a0e47266-3dfe-11ec-99c6-f8ac65e53322', '/', '127.0.0.1', NULL, 'gac', '2021-11-05 14:07:17', NULL);
INSERT INTO `sys_oper_log` VALUES ('aee2bcb1-ae86-11ec-9f28-f8ac65e53322', '/manage/test_permission_required', '127.0.0.1', NULL, NULL, '2022-03-28 19:03:22', 'not found the given id');
INSERT INTO `sys_oper_log` VALUES ('b132e772-ae80-11ec-abbf-f8ac65e53322', '/manage/test_permission_required', '127.0.0.1', NULL, NULL, '2022-03-28 18:20:29', 'not found the given id');
INSERT INTO `sys_oper_log` VALUES ('bfde4d3a-ae7b-11ec-9d55-f8ac65e53322', '/auth/login', '127.0.0.1', NULL, 'gac00', '2022-03-28 17:45:06', 'wrong password');
INSERT INTO `sys_oper_log` VALUES ('c989fb0d-ae7b-11ec-9100-f8ac65e53322', '/auth/login', '127.0.0.1', NULL, 'gac0000', '2022-03-28 17:45:23', 'wrong user_id');
INSERT INTO `sys_oper_log` VALUES ('cf780812-ae7b-11ec-b70a-f8ac65e53322', '/auth/login', '127.0.0.1', NULL, 'gac00', '2022-03-28 17:45:33', 'wrong password');
INSERT INTO `sys_oper_log` VALUES ('d0ae26cc-ae7b-11ec-8b27-f8ac65e53322', '/auth/login', '127.0.0.1', NULL, 'gac00', '2022-03-28 17:45:35', 'wrong password');
INSERT INTO `sys_oper_log` VALUES ('d12419e1-ae7b-11ec-9b21-f8ac65e53322', '/auth/login', '127.0.0.1', NULL, 'gac00', '2022-03-28 17:45:35', 'wrong password');
INSERT INTO `sys_oper_log` VALUES ('d19fb677-ae7b-11ec-88d9-f8ac65e53322', '/auth/login', '127.0.0.1', NULL, 'gac00', '2022-03-28 17:45:36', 'wrong password');
INSERT INTO `sys_oper_log` VALUES ('d220b509-ae7b-11ec-b231-f8ac65e53322', '/auth/login', '127.0.0.1', NULL, 'gac00', '2022-03-28 17:45:37', 'not reach cool down time');
INSERT INTO `sys_oper_log` VALUES ('d38ebce3-ae7b-11ec-9eae-f8ac65e53322', '/auth/login', '127.0.0.1', NULL, 'gac00', '2022-03-28 17:45:40', 'not reach cool down time');
INSERT INTO `sys_oper_log` VALUES ('d61ad0c2-ae80-11ec-a54b-f8ac65e53322', '/manage/test_permission_required', '127.0.0.1', NULL, NULL, '2022-03-28 18:21:31', 'not found the given id');
INSERT INTO `sys_oper_log` VALUES ('dd6b27b4-3011-11ec-b7ba-f8ac65e53322', '/auth/logout', '127.0.0.1', NULL, 'gac', '2021-10-18 20:49:43', NULL);
INSERT INTO `sys_oper_log` VALUES ('ddb63060-ae7f-11ec-8b00-f8ac65e53322', '/manage/test_permission_required', '127.0.0.1', NULL, 'gac00', '2022-03-28 18:14:35', NULL);
INSERT INTO `sys_oper_log` VALUES ('deac7d75-ae7f-11ec-9f05-f8ac65e53322', '/manage/test_permission_required', '127.0.0.1', NULL, 'gac00', '2022-03-28 18:14:36', NULL);
INSERT INTO `sys_oper_log` VALUES ('e45b531e-ae7f-11ec-bb27-f8ac65e53322', '/manage/test_permission_required', '127.0.0.1', NULL, 'gac00', '2022-03-28 18:14:46', NULL);
INSERT INTO `sys_oper_log` VALUES ('e542eb5f-3dfd-11ec-9fd7-f8ac65e53322', '/auth/login', '127.0.0.1', NULL, 'gac00', '2021-11-05 14:02:03', NULL);
INSERT INTO `sys_oper_log` VALUES ('e5499e98-3df8-11ec-99de-f8ac65e53322', '/auth/login', '127.0.0.1', NULL, 'gac00', '2021-11-05 13:26:16', NULL);
INSERT INTO `sys_oper_log` VALUES ('e8db8b37-ae7b-11ec-b799-f8ac65e53322', '/auth/login', '127.0.0.1', NULL, 'gac00', '2022-03-28 17:46:15', 'login success');
INSERT INTO `sys_oper_log` VALUES ('ed35e610-3011-11ec-9201-f8ac65e53322', '/auth/logout', '127.0.0.1', NULL, 'gac', '2021-10-18 20:50:09', NULL);
INSERT INTO `sys_oper_log` VALUES ('ef7405ee-ae86-11ec-8027-f8ac65e53322', '/manage/test_permission_required', '127.0.0.1', NULL, NULL, '2022-03-28 19:05:11', 'not found the given id');
INSERT INTO `sys_oper_log` VALUES ('efb5be35-3011-11ec-a6ff-f8ac65e53322', '/auth/logout', '127.0.0.1', NULL, 'gac', '2021-10-18 20:50:14', NULL);
INSERT INTO `sys_oper_log` VALUES ('f1727c5f-ae7f-11ec-bad0-f8ac65e53322', '/manage/test_permission_required', '127.0.0.1', NULL, 'gac00', '2022-03-28 18:15:08', 'beyond session keep time');
INSERT INTO `sys_oper_log` VALUES ('f3d352ad-ae86-11ec-b5fd-f8ac65e53322', '/manage/test_permission_required', '127.0.0.1', NULL, NULL, '2022-03-28 19:05:18', 'excp: no exception information');
INSERT INTO `sys_oper_log` VALUES ('f67eb3a1-ae87-11ec-87e0-f8ac65e53322', '/auth/login', '127.0.0.1', NULL, 'gac_00', '2022-03-28 19:12:32', 'login success');
INSERT INTO `sys_oper_log` VALUES ('f9fb84d5-ae87-11ec-a6f9-f8ac65e53322', '/manage/test_permission_required', '127.0.0.1', NULL, 'gac_00', '2022-03-28 19:12:38', 'not enough permission');
INSERT INTO `sys_oper_log` VALUES ('fd9bdf7b-ae87-11ec-92c3-f8ac65e53322', '/auth/login', '127.0.0.1', NULL, 'gac_00', '2022-03-28 19:12:44', 'login success');
INSERT INTO `sys_oper_log` VALUES ('ff0770d5-ae7f-11ec-9986-f8ac65e53322', '/auth/login', '127.0.0.1', NULL, 'gac00', '2022-03-28 18:15:30', 'login success');
INSERT INTO `sys_oper_log` VALUES ('ff49fdd1-ae87-11ec-b3b5-f8ac65e53322', '/manage/test_permission_required', '127.0.0.1', NULL, 'gac_00', '2022-03-28 19:12:47', 'not enough permission');

SET FOREIGN_KEY_CHECKS = 1;

--------------------------------------------------------																																							
--  File created - Tuesday-September-23-2025																																							
--------------------------------------------------------																																							
--------------------------------------------------------																																							
--  DDL for DB Link MNET																																							
--------------------------------------------------------																																							
																																							
CREATE DATABASE LINK "MNET"																																							
CONNECT TO "MS7ABA" IDENTIFIED BY VALUES ':1'																																							
USING 'MNET';																																							
--------------------------------------------------------																																							
--  DDL for Sequence ABA0212_SB_REPORT_SEQ																																							
--------------------------------------------------------																																							
																																							
CREATE SEQUENCE  "MS9ABA"."ABA0212_SB_REPORT_SEQ"  MINVALUE 1 MAXVALUE 9999999999999999999999999999 INCREMENT BY 1 START WITH 1 CACHE 20 NOORDER  NOCYCLE  NOKEEP  NOSCALE  GLOBAL ;																																							
--------------------------------------------------------																																							
--  DDL for Sequence ABA0213_SB_REPORT_FILE_SEQ																																							
--------------------------------------------------------																																							
																																							
CREATE SEQUENCE  "MS9ABA"."ABA0213_SB_REPORT_FILE_SEQ"  MINVALUE 1 MAXVALUE 9999999999999999999999999999 INCREMENT BY 1 START WITH 14202 CACHE 20 NOORDER  NOCYCLE  NOKEEP  NOSCALE  GLOBAL ;																																							
--------------------------------------------------------																																							
--  DDL for Sequence ABA0223_SB_APPLICANT_SEQ																																							
--------------------------------------------------------																																							
																																							
CREATE SEQUENCE  "MS9ABA"."ABA0223_SB_APPLICANT_SEQ"  MINVALUE 1 MAXVALUE 9999999999999999999999999999 INCREMENT BY 1 START WITH 96335 CACHE 20 NOORDER  NOCYCLE  NOKEEP  NOSCALE  GLOBAL ;																																							
--------------------------------------------------------																																							
--  DDL for Sequence ABA0224_SB_SUBSCRIPTION_SEQ																																							
--------------------------------------------------------																																							
																																							
CREATE SEQUENCE  "MS9ABA"."ABA0224_SB_SUBSCRIPTION_SEQ"  MINVALUE 1 MAXVALUE 9999999999999999999999999999 INCREMENT BY 1 START WITH 1 CACHE 20 NOORDER  NOCYCLE  NOKEEP  NOSCALE  GLOBAL ;																																							
--------------------------------------------------------																																							
--  DDL for Sequence ABA0224_SB_SUB_SEQ																																							
--------------------------------------------------------																																							
																																							
CREATE SEQUENCE  "MS9ABA"."ABA0224_SB_SUB_SEQ"  MINVALUE 1 MAXVALUE 9999999999999999999999999999 INCREMENT BY 1 START WITH 7889 CACHE 20 NOORDER  NOCYCLE  NOKEEP  NOSCALE  GLOBAL ;																																							
--------------------------------------------------------																																							
--  DDL for Sequence ABA0225_SB_SUB_DT_SEQ																																							
--------------------------------------------------------																																							
																																							
CREATE SEQUENCE  "MS9ABA"."ABA0225_SB_SUB_DT_SEQ"  MINVALUE 1 MAXVALUE 9999999999999999999999999999 INCREMENT BY 1 START WITH 370792 CACHE 20 NOORDER  NOCYCLE  NOKEEP  NOSCALE  GLOBAL ;																																							
--------------------------------------------------------																																							
--  DDL for Sequence ABA0226_SB_SUB_DT_ERR_SEQ																																							
--------------------------------------------------------																																							
																																							
CREATE SEQUENCE  "MS9ABA"."ABA0226_SB_SUB_DT_ERR_SEQ"  MINVALUE 1 MAXVALUE 9999999999999999999999999999 INCREMENT BY 1 START WITH 21141 CACHE 20 NOORDER  NOCYCLE  NOKEEP  NOSCALE  GLOBAL ;																																							
--------------------------------------------------------																																							
--  DDL for Sequence ABA0227_SB_REDEMPTION_SEQ																																							
--------------------------------------------------------																																							
																																							
CREATE SEQUENCE  "MS9ABA"."ABA0227_SB_REDEMPTION_SEQ"  MINVALUE 1 MAXVALUE 9999999999999999999999999999 INCREMENT BY 1 START WITH 7272 CACHE 20 NOORDER  NOCYCLE  NOKEEP  NOSCALE  GLOBAL ;																																							
--------------------------------------------------------																																							
--  DDL for Sequence ABA0228_SB_REDEMPTION_DT_SEQ																																							
--------------------------------------------------------																																							
																																							
CREATE SEQUENCE  "MS9ABA"."ABA0228_SB_REDEMPTION_DT_SEQ"  MINVALUE 1 MAXVALUE 9999999999999999999999999999 INCREMENT BY 1 START WITH 282292 CACHE 20 NOORDER  NOCYCLE  NOKEEP  NOSCALE  GLOBAL ;																																							
--------------------------------------------------------																																							
--  DDL for Sequence ABA0229_SB_REDEM_DT_ERR_SEQ																																							
--------------------------------------------------------																																							
																																							
CREATE SEQUENCE  "MS9ABA"."ABA0229_SB_REDEM_DT_ERR_SEQ"  MINVALUE 1 MAXVALUE 9999999999999999999999999999 INCREMENT BY 1 START WITH 35428 CACHE 20 NOORDER  NOCYCLE  NOKEEP  NOSCALE  GLOBAL ;																																							
--------------------------------------------------------																																							
--  DDL for Sequence ABA0230_SB_HLD_INFO_SEQ																																							
--------------------------------------------------------																																							
																																							
CREATE SEQUENCE  "MS9ABA"."ABA0230_SB_HLD_INFO_SEQ"  MINVALUE 1 MAXVALUE 9999999999999999999999999999 INCREMENT BY 1 START WITH 8206 CACHE 20 NOORDER  NOCYCLE  NOKEEP  NOSCALE  GLOBAL ;																																							
--------------------------------------------------------																																							
--  DDL for Sequence ABA0230_SB_HOLDING_INFO_SEQ																																							
--------------------------------------------------------																																							
																																							
CREATE SEQUENCE  "MS9ABA"."ABA0230_SB_HOLDING_INFO_SEQ"  MINVALUE 1 MAXVALUE 9999999999999999999999999999 INCREMENT BY 1 START WITH 1 CACHE 20 NOORDER  NOCYCLE  NOKEEP  NOSCALE  GLOBAL ;																																							
--------------------------------------------------------																																							
--  DDL for Sequence ABA0231_SB_HLD_INFO_DT_SEQ																																							
--------------------------------------------------------																																							
																																							
CREATE SEQUENCE  "MS9ABA"."ABA0231_SB_HLD_INFO_DT_SEQ"  MINVALUE 1 MAXVALUE 9999999999999999999999999999 INCREMENT BY 1 START WITH 667463 CACHE 20 NOORDER  NOCYCLE  NOKEEP  NOSCALE  GLOBAL ;																																							
--------------------------------------------------------																																							
--  DDL for Sequence ABA0232_SB_ALLOT_RESULT_SEQ																																							
--------------------------------------------------------																																							
																																							
CREATE SEQUENCE  "MS9ABA"."ABA0232_SB_ALLOT_RESULT_SEQ"  MINVALUE 1 MAXVALUE 9999999999999999999999999999 INCREMENT BY 1 START WITH 222171 CACHE 20 NOORDER  NOCYCLE  NOKEEP  NOSCALE  GLOBAL ;																																							
--------------------------------------------------------																																							
--  DDL for Sequence ABA0233_SB_BATCH_JOB_SEQ																																							
--------------------------------------------------------																																							
																																							
CREATE SEQUENCE  "MS9ABA"."ABA0233_SB_BATCH_JOB_SEQ"  MINVALUE 1 MAXVALUE 9999999999999999999999999999 INCREMENT BY 1 START WITH 31601 CACHE 20 NOORDER  NOCYCLE  NOKEEP  NOSCALE  GLOBAL ;																																							
--------------------------------------------------------																																							
--  DDL for Sequence ABA0234_SB_BATCH_JOB_EXE_SEQ																																							
--------------------------------------------------------																																							
																																							
CREATE SEQUENCE  "MS9ABA"."ABA0234_SB_BATCH_JOB_EXE_SEQ"  MINVALUE 1 MAXVALUE 9999999999999999999999999999 INCREMENT BY 1 START WITH 31864 CACHE 20 NOORDER  NOCYCLE  NOKEEP  NOSCALE  GLOBAL ;																																							
--------------------------------------------------------																																							
--  DDL for Sequence ABA0235_SB_SUBMISSION_SUM_SEQ																																							
--------------------------------------------------------																																							
																																							
CREATE SEQUENCE  "MS9ABA"."ABA0235_SB_SUBMISSION_SUM_SEQ"  MINVALUE 1 MAXVALUE 9999999999999999999999999999 INCREMENT BY 1 START WITH 8404 CACHE 20 NOORDER  NOCYCLE  NOKEEP  NOSCALE  GLOBAL ;																																							
--------------------------------------------------------																																							
--  DDL for Sequence ABA0236_SB_HLD_INFO_ERR_SEQ																																							
--------------------------------------------------------																																							
																																							
CREATE SEQUENCE  "MS9ABA"."ABA0236_SB_HLD_INFO_ERR_SEQ"  MINVALUE 1 MAXVALUE 9999999999999999999999999999 INCREMENT BY 1 START WITH 178211 CACHE 20 NOORDER  NOCYCLE  NOKEEP  NOSCALE  GLOBAL ;																																							
--------------------------------------------------------																																							
--  DDL for Sequence ABA0241_SB_RESULT_FILE_SEQ																																							
--------------------------------------------------------																																							
																																							
CREATE SEQUENCE  "MS9ABA"."ABA0241_SB_RESULT_FILE_SEQ"  MINVALUE 1 MAXVALUE 9999999999999999999999999999 INCREMENT BY 1 START WITH 16329 CACHE 20 NOORDER  NOCYCLE  NOKEEP  NOSCALE  GLOBAL ;																																							
--------------------------------------------------------																																							
--  DDL for Sequence ABA0250_SB_AUDIT_LOG_SEQ																																							
--------------------------------------------------------																																							
																																							
CREATE SEQUENCE  "MS9ABA"."ABA0250_SB_AUDIT_LOG_SEQ"  MINVALUE 1 MAXVALUE 9999999999999999999999999999 INCREMENT BY 1 START WITH 13093 CACHE 20 NOORDER  NOCYCLE  NOKEEP  NOSCALE  GLOBAL ;																																							
--------------------------------------------------------																																							
--  DDL for Sequence ABA0251_SB_CONT_MAKE_CHECK_SEQ																																							
--------------------------------------------------------																																							
																																							
CREATE SEQUENCE  "MS9ABA"."ABA0251_SB_CONT_MAKE_CHECK_SEQ"  MINVALUE 1 MAXVALUE 9999999999999999999999999999 INCREMENT BY 1 START WITH 1491 CACHE 20 NOORDER  NOCYCLE  NOKEEP  NOSCALE  GLOBAL ;																																							
--------------------------------------------------------																																							
--  DDL for Sequence ABA0252_SB_SYSCONFIG_LOG_SEQ																																							
--------------------------------------------------------																																							
																																							
CREATE SEQUENCE  "MS9ABA"."ABA0252_SB_SYSCONFIG_LOG_SEQ"  MINVALUE 1 MAXVALUE 9999999999999999999999999999 INCREMENT BY 1 START WITH 1473 CACHE 20 NOORDER  NOCYCLE  NOKEEP  NOSCALE  GLOBAL ;																																							
--------------------------------------------------------																																							
--  DDL for Sequence ABA0283_COUPON_SEQ																																							
--------------------------------------------------------																																							
																																							
CREATE SEQUENCE  "MS9ABA"."ABA0283_COUPON_SEQ"  MINVALUE 1 MAXVALUE 99999999999999999999 INCREMENT BY 1 START WITH 3856 CACHE 20 NOORDER  NOCYCLE  NOKEEP  NOSCALE  GLOBAL ;																																							
--------------------------------------------------------																																							
--  DDL for Sequence ABA0300_SB_AUDIT_LOG_SEQ																																							
--------------------------------------------------------																																							
																																							
CREATE SEQUENCE  "MS9ABA"."ABA0300_SB_AUDIT_LOG_SEQ"  MINVALUE 1 MAXVALUE 9999999999999999999999999999 INCREMENT BY 1 START WITH 1 CACHE 20 NOORDER  NOCYCLE  NOKEEP  NOSCALE  GLOBAL ;																																							
--------------------------------------------------------																																							
--  DDL for Sequence BATCH_JOB_EXECUTION_SEQ																																							
--------------------------------------------------------																																							
																																							
CREATE SEQUENCE  "MS9ABA"."BATCH_JOB_EXECUTION_SEQ"  MINVALUE 0 MAXVALUE 9223372036854775807 INCREMENT BY 1 START WITH 35375 CACHE 20 NOORDER  NOCYCLE  NOKEEP  NOSCALE  GLOBAL ;																																							
--------------------------------------------------------																																							
--  DDL for Sequence BATCH_JOB_SEQ																																							
--------------------------------------------------------																																							
																																							
CREATE SEQUENCE  "MS9ABA"."BATCH_JOB_SEQ"  MINVALUE 0 MAXVALUE 9223372036854775807 INCREMENT BY 1 START WITH 35355 CACHE 20 NOORDER  NOCYCLE  NOKEEP  NOSCALE  GLOBAL ;																																							
--------------------------------------------------------																																							
--  DDL for Sequence BATCH_STEP_EXECUTION_SEQ																																							
--------------------------------------------------------																																							
																																							
CREATE SEQUENCE  "MS9ABA"."BATCH_STEP_EXECUTION_SEQ"  MINVALUE 0 MAXVALUE 9223372036854775807 INCREMENT BY 1 START WITH 64990 CACHE 20 NOORDER  NOCYCLE  NOKEEP  NOSCALE  GLOBAL ;																																							
--------------------------------------------------------																																							
--  DDL for Sequence ERF_LOG_SEQ_NO																																							
--------------------------------------------------------																																							
																																							
CREATE SEQUENCE  "MS9ABA"."ERF_LOG_SEQ_NO"  MINVALUE 1 MAXVALUE 99999 INCREMENT BY 1 START WITH 1 NOCACHE  NOORDER  NOCYCLE  NOKEEP  NOSCALE  GLOBAL ;																																							
--------------------------------------------------------																																							
--  DDL for Sequence LOG_SEQ_NO																																							
--------------------------------------------------------																																							
																																							
CREATE SEQUENCE  "MS9ABA"."LOG_SEQ_NO"  MINVALUE 1 MAXVALUE 99999 INCREMENT BY 1 START WITH 1 NOCACHE  NOORDER  NOCYCLE  NOKEEP  NOSCALE  GLOBAL ;																																							
--------------------------------------------------------																																							
--  DDL for Sequence TASK_SEQ_NO																																							
--------------------------------------------------------																																							
																																							
CREATE SEQUENCE  "MS9ABA"."TASK_SEQ_NO"  MINVALUE 1 MAXVALUE 99999 INCREMENT BY 1 START WITH 6 NOCACHE  NOORDER  NOCYCLE  NOKEEP  NOSCALE  GLOBAL ;																																							
--------------------------------------------------------																																							
--  DDL for Sequence TRANS_REF_NO																																							
--------------------------------------------------------																																							
																																							
CREATE SEQUENCE  "MS9ABA"."TRANS_REF_NO"  MINVALUE 1 MAXVALUE 99999999 INCREMENT BY 1 START WITH 1 NOCACHE  NOORDER  NOCYCLE  NOKEEP  NOSCALE  GLOBAL ;																																							
--------------------------------------------------------																																							
--  DDL for Table ABA0001_SECURITY_MASTER																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."ABA0001_SECURITY_MASTER"																																							
(	ABA0001_SECURITY_CODE CHAR(8 BYTE),																																						
	ABA0001_ISSUE_NO CHAR(1 BYTE),																																						
	ABA0001_ISSUE_TYPE CHAR(1 BYTE),																																						
	ABA0001_CURR CHAR(3 BYTE),																																						
	ABA0001_SECURITY_NAME VARCHAR2(30 BYTE),																																						
	ABA0001_ISSUE_DATE DATE,																																						
	ABA0001_TENDER_DATE DATE,																																						
	ABA0001_ISSUE_SIZE NUMBER(13,0),																																						
	ABA0001_QTY_APPLIED NUMBER(13,0),																																						
	ABA0001_AVE_YIELD NUMBER(5,2),																																						
	ABA0001_CUTOFF_YIELD NUMBER(5,2),																																						
	ABA0001_MATURITY_DATE DATE,																																						
	ABA0001_PERCENT_COY NUMBER(5,2),																																						
	ABA0001_PERCENT_SUB NUMBER(5,2),																																						
	ABA0001_INTEREST_RATE NUMBER(7,4),																																						
	ABA0001_TAX_STATUS CHAR(1 BYTE),																																						
	ABA0001_AVE_PRICE NUMBER(7,4),																																						
	ABA0001_COY_PRICE NUMBER(7,4),																																						
	ABA0001_CLOSING_PRICE NUMBER(7,4),																																						
	ABA0001_REFERENCE_NO NUMBER(5,0),																																						
	ABA0001_ISIN_CODE CHAR(12 BYTE),																																						
	ABA0001_ANNOUNCE_DATE DATE,																																						
	ABA0001_RESULT_LOAD_DATE DATE,																																						
	ABA0001_LAST_INT_DATE DATE,																																						
	ABA0001_NEXT_INT_DATE DATE,																																						
	ABA0001_ACCRUED_INT_DAYS NUMBER(3,0),																																						
	ABA0001_INT_DATE1 DATE,																																						
	ABA0001_INT_DATE2 DATE,																																						
	ABA0001_INT_PAID_IND CHAR(1 BYTE) DEFAULT 'N',																																						
	ABA0001_TENOR NUMBER(3,0),																																						
	ABA0001_ETENDER_IND CHAR(1 BYTE) DEFAULT 'Y',																																						
	ABA0001_MAS_APPLIED NUMBER(13,0),																																						
	ABA0001_MAS_ALLOTTED NUMBER(13,0),																																						
	ABA0001_NC_PERCENT NUMBER(5,2),																																						
	ABA0001_NC_QTY_ALLOT NUMBER(13,0),																																						
	ABA0001_EX_INT_DATE DATE,																																						
	ABA0001_QTY_APP_COMP NUMBER(13,0),																																						
	ABA0001_QTY_APP_NONCOMP NUMBER(13,0),																																						
	ABA0001_ACCRUED_INT NUMBER(7,4) DEFAULT 0,																																						
	ABA0001_ANNOUNCE_INDICATOR CHAR(1 BYTE) DEFAULT 'N',																																						
	ABA0001_MEDIAN_YIELD NUMBER(5,2),																																						
	ABA0001_MEDIAN_PRICE NUMBER(7,4)																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 32768 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table ABA0001_SECURITY_MASTER_20230515																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."ABA0001_SECURITY_MASTER_20230515"																																							
(	ABA0001_SECURITY_CODE CHAR(8 BYTE),																																						
	ABA0001_ISSUE_NO VARCHAR2(3 BYTE),																																						
	ABA0001_CURR CHAR(3 BYTE),																																						
	ABA0001_SECURITY_NAME VARCHAR2(50 BYTE),																																						
	ABA0001_ISSUE_DATE DATE,																																						
	ABA0001_TENDER_DATE DATE,																																						
	ABA0001_ISSUE_SIZE NUMBER(16,0),																																						
	ABA0001_QTY_APPLIED NUMBER(16,0),																																						
	ABA0001_AVE_YIELD NUMBER(5,2),																																						
	ABA0001_CUTOFF_YIELD NUMBER(5,2),																																						
	ABA0001_MATURITY_DATE DATE,																																						
	ABA0001_PERCENT_COY NUMBER(5,2),																																						
	ABA0001_PERCENT_SUB NUMBER(5,2),																																						
	ABA0001_INTEREST_RATE NUMBER(7,4),																																						
	ABA0001_TAX_STATUS CHAR(1 BYTE),																																						
	ABA0001_AVE_PRICE NUMBER(7,4),																																						
	ABA0001_COY_PRICE NUMBER(7,4),																																						
	ABA0001_CLOSING_PRICE NUMBER(9,4),																																						
	ABA0001_REFERENCE_NO NUMBER(5,0),																																						
	ABA0001_ISIN_CODE CHAR(12 BYTE),																																						
	ABA0001_ANNOUNCE_DATE DATE,																																						
	ABA0001_RESULT_LOAD_DATE DATE,																																						
	ABA0001_LAST_INT_DATE DATE,																																						
	ABA0001_NEXT_INT_DATE DATE,																																						
	ABA0001_ACCRUED_INT_DAYS NUMBER(3,0),																																						
	ABA0001_INT_DATE1 DATE,																																						
	ABA0001_INT_DATE2 DATE,																																						
	ABA0001_INT_PAID_IND CHAR(1 BYTE),																																						
	ABA0001_TENOR NUMBER(3,0),																																						
	ABA0001_ETENDER_IND CHAR(1 BYTE),																																						
	ABA0001_MAS_APPLIED NUMBER(16,0),																																						
	ABA0001_MAS_ALLOTTED NUMBER(16,0),																																						
	ABA0001_NC_PERCENT NUMBER(5,2),																																						
	ABA0001_NC_QTY_ALLOT NUMBER(16,0),																																						
	ABA0001_EX_INT_DATE DATE,																																						
	ABA0001_QTY_APP_COMP NUMBER(16,0),																																						
	ABA0001_QTY_APP_NONCOMP NUMBER(16,0),																																						
	ABA0001_ACCRUED_INT NUMBER(7,4),																																						
	ABA0001_ANNOUNCE_INDICATOR CHAR(1 BYTE),																																						
	ABA0001_MEDIAN_YIELD NUMBER(5,2),																																						
	ABA0001_MEDIAN_PRICE NUMBER(7,4),																																						
	ABA0001_SEC_CAT VARCHAR2(10 BYTE),																																						
	ABA0001_SEC_TYPE_ID VARCHAR2(10 BYTE),																																						
	ABA0001_SEC_TYPE_DESC VARCHAR2(35 BYTE),																																						
	ABA0001_BENCHMARK_IND CHAR(1 BYTE),																																						
	ABA0001_FIRST_CPN_PAYM_DATE DATE,																																						
	ABA0001_TENOR_UNIT CHAR(1 BYTE),																																						
	ABA0001_RECORD_DATE DATE																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table ABA0001_SECURITY_MASTER_20230516																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."ABA0001_SECURITY_MASTER_20230516"																																							
(	ABA0001_SECURITY_CODE CHAR(8 BYTE),																																						
	ABA0001_ISSUE_NO VARCHAR2(3 BYTE),																																						
	ABA0001_CURR CHAR(3 BYTE),																																						
	ABA0001_SECURITY_NAME VARCHAR2(50 BYTE),																																						
	ABA0001_ISSUE_DATE DATE,																																						
	ABA0001_TENDER_DATE DATE,																																						
	ABA0001_ISSUE_SIZE NUMBER(16,0),																																						
	ABA0001_QTY_APPLIED NUMBER(16,0),																																						
	ABA0001_AVE_YIELD NUMBER(5,2),																																						
	ABA0001_CUTOFF_YIELD NUMBER(5,2),																																						
	ABA0001_MATURITY_DATE DATE,																																						
	ABA0001_PERCENT_COY NUMBER(5,2),																																						
	ABA0001_PERCENT_SUB NUMBER(5,2),																																						
	ABA0001_INTEREST_RATE NUMBER(7,4),																																						
	ABA0001_TAX_STATUS CHAR(1 BYTE),																																						
	ABA0001_AVE_PRICE NUMBER(7,4),																																						
	ABA0001_COY_PRICE NUMBER(7,4),																																						
	ABA0001_CLOSING_PRICE NUMBER(9,4),																																						
	ABA0001_REFERENCE_NO NUMBER(5,0),																																						
	ABA0001_ISIN_CODE CHAR(12 BYTE),																																						
	ABA0001_ANNOUNCE_DATE DATE,																																						
	ABA0001_RESULT_LOAD_DATE DATE,																																						
	ABA0001_LAST_INT_DATE DATE,																																						
	ABA0001_NEXT_INT_DATE DATE,																																						
	ABA0001_ACCRUED_INT_DAYS NUMBER(3,0),																																						
	ABA0001_INT_DATE1 DATE,																																						
	ABA0001_INT_DATE2 DATE,																																						
	ABA0001_INT_PAID_IND CHAR(1 BYTE),																																						
	ABA0001_TENOR NUMBER(3,0),																																						
	ABA0001_ETENDER_IND CHAR(1 BYTE),																																						
	ABA0001_MAS_APPLIED NUMBER(16,0),																																						
	ABA0001_MAS_ALLOTTED NUMBER(16,0),																																						
	ABA0001_NC_PERCENT NUMBER(5,2),																																						
	ABA0001_NC_QTY_ALLOT NUMBER(16,0),																																						
	ABA0001_EX_INT_DATE DATE,																																						
	ABA0001_QTY_APP_COMP NUMBER(16,0),																																						
	ABA0001_QTY_APP_NONCOMP NUMBER(16,0),																																						
	ABA0001_ACCRUED_INT NUMBER(7,4),																																						
	ABA0001_ANNOUNCE_INDICATOR CHAR(1 BYTE),																																						
	ABA0001_MEDIAN_YIELD NUMBER(5,2),																																						
	ABA0001_MEDIAN_PRICE NUMBER(7,4),																																						
	ABA0001_SEC_CAT VARCHAR2(10 BYTE),																																						
	ABA0001_SEC_TYPE_ID VARCHAR2(10 BYTE),																																						
	ABA0001_SEC_TYPE_DESC VARCHAR2(35 BYTE),																																						
	ABA0001_BENCHMARK_IND CHAR(1 BYTE),																																						
	ABA0001_FIRST_CPN_PAYM_DATE DATE,																																						
	ABA0001_TENOR_UNIT CHAR(1 BYTE),																																						
	ABA0001_RECORD_DATE DATE																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table ABA0001_SECURITY_MASTER_R2_20231212																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."ABA0001_SECURITY_MASTER_R2_20231212"																																							
(	ABA0001_SECURITY_CODE CHAR(8 BYTE),																																						
	ABA0001_ISSUE_NO CHAR(1 BYTE),																																						
	ABA0001_ISSUE_TYPE CHAR(1 BYTE),																																						
	ABA0001_CURR CHAR(3 BYTE),																																						
	ABA0001_SECURITY_NAME VARCHAR2(30 BYTE),																																						
	ABA0001_ISSUE_DATE DATE,																																						
	ABA0001_TENDER_DATE DATE,																																						
	ABA0001_ISSUE_SIZE NUMBER(13,0),																																						
	ABA0001_QTY_APPLIED NUMBER(13,0),																																						
	ABA0001_AVE_YIELD NUMBER(5,2),																																						
	ABA0001_CUTOFF_YIELD NUMBER(5,2),																																						
	ABA0001_MATURITY_DATE DATE,																																						
	ABA0001_PERCENT_COY NUMBER(5,2),																																						
	ABA0001_PERCENT_SUB NUMBER(5,2),																																						
	ABA0001_INTEREST_RATE NUMBER(7,4),																																						
	ABA0001_TAX_STATUS CHAR(1 BYTE),																																						
	ABA0001_AVE_PRICE NUMBER(7,4),																																						
	ABA0001_COY_PRICE NUMBER(7,4),																																						
	ABA0001_CLOSING_PRICE NUMBER(7,4),																																						
	ABA0001_REFERENCE_NO NUMBER(5,0),																																						
	ABA0001_ISIN_CODE CHAR(12 BYTE),																																						
	ABA0001_ANNOUNCE_DATE DATE,																																						
	ABA0001_RESULT_LOAD_DATE DATE,																																						
	ABA0001_LAST_INT_DATE DATE,																																						
	ABA0001_NEXT_INT_DATE DATE,																																						
	ABA0001_ACCRUED_INT_DAYS NUMBER(3,0),																																						
	ABA0001_INT_DATE1 DATE,																																						
	ABA0001_INT_DATE2 DATE,																																						
	ABA0001_INT_PAID_IND CHAR(1 BYTE),																																						
	ABA0001_TENOR NUMBER(3,0),																																						
	ABA0001_ETENDER_IND CHAR(1 BYTE),																																						
	ABA0001_MAS_APPLIED NUMBER(13,0),																																						
	ABA0001_MAS_ALLOTTED NUMBER(13,0),																																						
	ABA0001_NC_PERCENT NUMBER(5,2),																																						
	ABA0001_NC_QTY_ALLOT NUMBER(13,0),																																						
	ABA0001_EX_INT_DATE DATE,																																						
	ABA0001_QTY_APP_COMP NUMBER(13,0),																																						
	ABA0001_QTY_APP_NONCOMP NUMBER(13,0),																																						
	ABA0001_ACCRUED_INT NUMBER(7,4),																																						
	ABA0001_ANNOUNCE_INDICATOR CHAR(1 BYTE),																																						
	ABA0001_MEDIAN_YIELD NUMBER(5,2),																																						
	ABA0001_MEDIAN_PRICE NUMBER(7,4)																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table ABA0006_AUCTION_RESULT																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."ABA0006_AUCTION_RESULT"																																							
(	ABA0006_SECURITY_CODE CHAR(8 BYTE),																																						
	ABA0006_ISSUE_NO CHAR(1 BYTE),																																						
	ABA0006_BANK_ACC_CODE NUMBER(4,0),																																						
	ABA0006_TENDER_DATE DATE,																																						
	ABA0006_LINE_NO NUMBER(9,0),																																						
	ABA0006_LINE_CONTENT VARCHAR2(200 BYTE),																																						
	ABA0006_UPDATE_TIME DATE DEFAULT SYSDATE																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 15728640 NEXT 32768 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table ABA0007_DETAIL_AUCTION_RESULT																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."ABA0007_DETAIL_AUCTION_RESULT"																																							
(	ABA0007_SECURITY_CODE VARCHAR2(8 BYTE),																																						
	ABA0007_ISSUE_NO VARCHAR2(1 BYTE),																																						
	ABA0007_REF_NO NUMBER(5,0),																																						
	ABA0007_BANK_REF_NO VARCHAR2(12 BYTE),																																						
	ABA0007_FORM_NO NUMBER(6,0),																																						
	ABA0007_TENDER_DATE DATE,																																						
	ABA0007_PRI_DLR_CODE NUMBER(4,0),																																						
	ABA0007_NAME_OF_APPLN VARCHAR2(30 BYTE),																																						
	ABA0007_NATIONALITY VARCHAR2(1 BYTE),																																						
	ABA0007_IC_PASSPORT VARCHAR2(14 BYTE),																																						
	ABA0007_COMP_NONCOMP VARCHAR2(1 BYTE),																																						
	ABA0007_BID_YIELD NUMBER(5,2),																																						
	ABA0007_APPLIED_AMT NUMBER(11,0),																																						
	ABA0007_ALLOTED_AMT NUMBER(11,0),																																						
	ABA0007_SETTLEMENT_AMT NUMBER(15,2),																																						
	ABA0007_ACCRUED_INT NUMBER(11,2),																																						
	ABA0007_CUST_BANK_CODE NUMBER(4,0),																																						
	ABA0007_CUST_BANK_BC VARCHAR2(1 BYTE),																																						
	ABA0007_TYPE_OF_APPLN VARCHAR2(3 BYTE),																																						
	ABA0007_CDP_ACC_NO VARCHAR2(16 BYTE),																																						
	ABA0007_SUB_MTD CHAR(1 BYTE),																																						
	ABA0007_UPDATED_DATETIME DATE DEFAULT SYSDATE,																																						
	ABA0007_CPF_ACNO CHAR(16 BYTE),																																						
	ABA0007_FILE_TYPE VARCHAR2(3 BYTE) DEFAULT 'AP1'																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 516096 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table ABA0008_AUCTION_AUDIT_LOG																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."ABA0008_AUCTION_AUDIT_LOG"																																							
(	ABA0008_USER_ID VARCHAR2(20 BYTE),																																						
	ABA0008_ACTION VARCHAR2(1000 BYTE),																																						
	ABA0008_UPDATED_DT DATE DEFAULT SYSDATE																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 2097152 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table ABA0009_EAUCTION_CONFIG																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."ABA0009_EAUCTION_CONFIG"																																							
(	ABA0009_KEY VARCHAR2(50 BYTE),																																						
	ABA0009_VALUE VARCHAR2(100 BYTE)																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table ABA0009_EAUCTION_CONFIG_TMP																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."ABA0009_EAUCTION_CONFIG_TMP"																																							
(	ABA0009_KEY VARCHAR2(50 BYTE),																																						
	ABA0009_VALUE VARCHAR2(100 BYTE)																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 65536 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table ABA0010_EAUCTION_AUCTION_CUTOFF_TIME																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."ABA0010_EAUCTION_AUCTION_CUTOFF_TIME"																																							
(	ABA0010_NAME VARCHAR2(50 BYTE),																																						
	ABA0010_DEFAULT_CUTOFF_TIME VARCHAR2(100 BYTE),																																						
	ABA0010_CUTOFF_TIME VARCHAR2(100 BYTE),																																						
	ABA0010_STATUS CHAR(1 BYTE),																																						
	ABA0010_MODIFIED_BY VARCHAR2(20 BYTE),																																						
	ABA0010_MODIFIED_DATE TIMESTAMP (6)																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table ABA0035_SECURITY_MASTER_CTG_STG																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."ABA0035_SECURITY_MASTER_CTG_STG"																																							
(	ABA0035_SECURITY_CODE CHAR(8 BYTE),																																						
	ABA0035_ISSUE_NO CHAR(1 BYTE),																																						
	ABA0035_QTY_APPLIED NUMBER(13,0),																																						
	ABA0035_AVE_YIELD NUMBER(5,2),																																						
	ABA0035_CUTOFF_YIELD NUMBER(5,2),																																						
	ABA0035_PERCENT_COY NUMBER(5,2),																																						
	ABA0035_PERCENT_SUB NUMBER(5,2),																																						
	ABA0035_INTEREST_RATE NUMBER(7,4),																																						
	ABA0035_AVE_PRICE NUMBER(7,4),																																						
	ABA0035_COY_PRICE NUMBER(7,4),																																						
	ABA0035_CLOSING_PRICE NUMBER(7,4),																																						
	ABA0035_MAS_ALLOTTED NUMBER(13,0),																																						
	ABA0035_NC_PERCENT NUMBER(5,2),																																						
	ABA0035_NC_QTY_ALLOT NUMBER(13,0),																																						
	ABA0035_QTY_APP_COMP NUMBER(13,0),																																						
	ABA0035_QTY_APP_NONCOMP NUMBER(13,0),																																						
	ABA0035_ACCRUED_INT NUMBER(7,4) DEFAULT 0,																																						
	ABA0035_MEDIAN_YIELD NUMBER(5,2),																																						
	ABA0035_MEDIAN_PRICE NUMBER(7,4)																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table ABA0036_RETAILBID_FILE																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."ABA0036_RETAILBID_FILE"																																							
(	ABA0036_FILE_NAME VARCHAR2(50 BYTE),																																						
	ABA0036_PROCESSING_DATE DATE,																																						
	ABA0036_PROCESSING_TIME TIMESTAMP (6),																																						
	ABA0036_ACKNOWLEDGEMENT_FILE_PATH VARCHAR2(300 BYTE),																																						
	ABA0036_ACKNOWLEDGEMENT_FILE_NAME VARCHAR2(150 BYTE)																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table ABA0212_SB_REPORT																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."ABA0212_SB_REPORT"																																							
(	ABA0212_SB_REPORT_ID NUMBER(19,0),																																						
	ABA0212_SB_REPORT_NAME VARCHAR2(255 BYTE),																																						
	ABA0212_SB_REPORT_TYPE VARCHAR2(1 BYTE)																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table ABA0213_SB_REPORT_FILE																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."ABA0213_SB_REPORT_FILE"																																							
(	ABA0213_SB_REPORT_FILE_ID NUMBER(19,0),																																						
	ABA0213_SB_REPORT_ID NUMBER(19,0),																																						
	ABA0213_SB_FILE_NAME VARCHAR2(255 BYTE),																																						
	ABA0213_SB_FILE_DESC VARCHAR2(255 BYTE),																																						
	ABA0213_SB_FILE_MIMETYPE VARCHAR2(5 BYTE),																																						
	ABA0213_SB_SECURITY_CODE VARCHAR2(8 BYTE),																																						
	ABA0213_SB_PROCESS_DT NUMBER(8,0),																																						
	ABA0213_SB_CREATED_DT TIMESTAMP (6) DEFAULT CURRENT_TIMESTAMP																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table ABA0214_SB_CD_FILE_TYPE																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."ABA0214_SB_CD_FILE_TYPE"																																							
(	ABA0214_SB_CD_FILE_TYPE VARCHAR2(3 BYTE),																																						
	ABA0214_SB_DESCRIPTION VARCHAR2(100 BYTE),																																						
	ABA0214_SB_TYPE_DISPLAY VARCHAR2(100 BYTE),																																						
	ABA0214_SB_OBS_IND CHAR(1 BYTE) DEFAULT 'N',																																						
	ABA0214_SB_TYPE_CATEGORY VARCHAR2(25 BYTE)																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table ABA0215_SB_CD_FILE_STATUS																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."ABA0215_SB_CD_FILE_STATUS"																																							
(	ABA0215_SB_CD_FILE_STATUS VARCHAR2(1 BYTE),																																						
	ABA0215_SB_DESCRIPTION VARCHAR2(100 BYTE)																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table ABA0216_SB_CD_RECORD_STATUS																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."ABA0216_SB_CD_RECORD_STATUS"																																							
(	ABA0216_SB_CD_RECORD_STATUS VARCHAR2(1 BYTE),																																						
	ABA0216_SB_DESCRIPTION VARCHAR2(100 BYTE)																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table ABA0217_SB_CD_NATION																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."ABA0217_SB_CD_NATION"																																							
(	ABA0217_SB_CD_NATION VARCHAR2(1 BYTE),																																						
	ABA0217_SB_DESCRIPTION VARCHAR2(100 BYTE)																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table ABA0218_SB_CD_NATION_CTY																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."ABA0218_SB_CD_NATION_CTY"																																							
(	ABA0218_SB_CD_NATION_CTY VARCHAR2(2 BYTE),																																						
	ABA0218_SB_DESCRIPTION VARCHAR2(100 BYTE)																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table ABA0219_SB_CD_FILE_ERROR_DESC																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."ABA0219_SB_CD_FILE_ERROR_DESC"																																							
(	ABA0219_SB_CD_FILE_ERR_DESC VARCHAR2(3 BYTE),																																						
	ABA0219_SB_DESCRIPTION VARCHAR2(20 BYTE)																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table ABA0220_SB_CD_RECORD_ERR_DESC																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."ABA0220_SB_CD_RECORD_ERR_DESC"																																							
(	ABA0220_SB_CD_RECORD_ERR_DESC VARCHAR2(3 BYTE),																																						
	ABA0220_SB_DESCRIPTION VARCHAR2(20 BYTE)																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table ABA0221_SB_CD_BATCHJOB_STATUS																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."ABA0221_SB_CD_BATCHJOB_STATUS"																																							
(	ABA0221_SB_CD_BATCHJOB_STATUS VARCHAR2(3 BYTE),																																						
	ABA0221_SB_DESCRIPTION VARCHAR2(255 BYTE)																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table ABA0222_SB_ORG																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."ABA0222_SB_ORG"																																							
(	ABA0222_SB_ORG_ID NUMBER(19,0),																																						
	ABA0222_SB_ORG_TYPE VARCHAR2(1 BYTE),																																						
	ABA0222_SB_ORG_CODE NUMBER(4,0),																																						
	ABA0222_SB_ORG_NAME VARCHAR2(20 BYTE),																																						
	ABA0222_SB_ORG_NAME_DESC VARCHAR2(255 BYTE),																																						
	ABA0222_SB_MEMEBER_CODE VARCHAR2(8 BYTE),																																						
	ABA0222_SB_CUSTODY_CODE VARCHAR2(3 BYTE),																																						
	ABA0222_SB_CREATED_DT TIMESTAMP (6) DEFAULT CURRENT_TIMESTAMP,																																						
	ABA0222_SB_LAST_MODIFIED_DT TIMESTAMP (6) DEFAULT CURRENT_TIMESTAMP,																																						
	ABA0234_SB_OMNIBUS_ACCT_NO VARCHAR2(16 BYTE),																																						
	ABA0222_SB_PGP_RECIPIENT_KEY VARCHAR2(50 BYTE)																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table ABA0223_SB_APPLICANT																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."ABA0223_SB_APPLICANT"																																							
(	ABA0223_SB_APPLICANT_ID NUMBER(19,0),																																						
	ABA0223_SB_IC_PASSPORT VARCHAR2(14 BYTE),																																						
	ABA0223_SB_NAME_OF_APPLN VARCHAR2(100 BYTE),																																						
	ABA0223_SB_CD_NATION VARCHAR2(1 BYTE),																																						
	ABA0223_SB_CD_NATION_CTY VARCHAR2(2 BYTE),																																						
	ABA0223_SB_CREATED_DT TIMESTAMP (6) DEFAULT CURRENT_TIMESTAMP,																																						
	ABA0223_SB_LAST_MODIFIED_DT TIMESTAMP (6) DEFAULT CURRENT_TIMESTAMP																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table ABA0224_SB_SUBSCRIPT																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."ABA0224_SB_SUBSCRIPT"																																							
(	ABA0224_SB_SUB_ID NUMBER(19,0),																																						
	ABA0224_SB_BATCH_JOB_ID NUMBER(19,0),																																						
	ABA0224_SB_ORG_ID NUMBER(19,0),																																						
	ABA0224_SB_CD_FILE_TYPE VARCHAR2(3 BYTE),																																						
	ABA0224_SB_CD_FILE_STATUS VARCHAR2(1 BYTE),																																						
	ABA0224_SB_CD_FILE_ERROR_DESC VARCHAR2(3 BYTE),																																						
	ABA0224_SB_SECURITY_CODE VARCHAR2(8 BYTE),																																						
	ABA0224_SB_ISIN_CODE VARCHAR2(12 BYTE),																																						
	ABA0224_SB_TENDER_DT NUMBER(8,0),																																						
	ABA0224_SB_CURR VARCHAR2(3 BYTE),																																						
	ABA0224_SB_ISSUE_DESC VARCHAR2(30 BYTE),																																						
	ABA0224_SB_PROCESS_DT NUMBER(8,0),																																						
	ABA0224_SB_RECORD_COUNT NUMBER(10,0),																																						
	ABA0224_SB_FILE_NAME VARCHAR2(100 BYTE),																																						
	ABA0224_SB_DELETED_DT DATE,																																						
	ABA0224_SB_ACKNOWLEDGED_DT DATE,																																						
	ABA0224_SB_CREATED_DT TIMESTAMP (6) DEFAULT CURRENT_TIMESTAMP,																																						
	ABA0224_SB_LAST_MODIFIED_DT TIMESTAMP (6) DEFAULT CURRENT_TIMESTAMP																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table ABA0224_SB_SUBSCRIPT_BKUP																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."ABA0224_SB_SUBSCRIPT_BKUP"																																							
(	ABA0224_SB_SUB_ID NUMBER(19,0),																																						
	ABA0224_SB_BATCH_JOB_ID NUMBER(19,0),																																						
	ABA0224_SB_ORG_ID NUMBER(19,0),																																						
	ABA0224_SB_CD_FILE_TYPE VARCHAR2(3 BYTE),																																						
	ABA0224_SB_CD_FILE_STATUS VARCHAR2(1 BYTE),																																						
	ABA0224_SB_CD_FILE_ERROR_DESC VARCHAR2(3 BYTE),																																						
	ABA0224_SB_SECURITY_CODE VARCHAR2(8 BYTE),																																						
	ABA0224_SB_ISIN_CODE VARCHAR2(12 BYTE),																																						
	ABA0224_SB_TENDER_DT NUMBER(8,0),																																						
	ABA0224_SB_CURR VARCHAR2(3 BYTE),																																						
	ABA0224_SB_ISSUE_DESC VARCHAR2(30 BYTE),																																						
	ABA0224_SB_PROCESS_DT NUMBER(8,0),																																						
	ABA0224_SB_RECORD_COUNT NUMBER(10,0),																																						
	ABA0224_SB_FILE_NAME VARCHAR2(100 BYTE),																																						
	ABA0224_SB_DELETED_DT DATE,																																						
	ABA0224_SB_ACKNOWLEDGED_DT DATE,																																						
	ABA0224_SB_CREATED_DT TIMESTAMP (6),																																						
	ABA0224_SB_LAST_MODIFIED_DT TIMESTAMP (6)																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table ABA0225_SB_SUBSCRIPT_DT																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."ABA0225_SB_SUBSCRIPT_DT"																																							
(	ABA0225_SB_SUB_DETAIL_ID NUMBER(19,0),																																						
	ABA0225_SB_SUB_ID NUMBER(19,0),																																						
	ABA0225_SB_APPLICANT_ID NUMBER(19,0),																																						
	ABA0225_SB_REFERENCE_NO NUMBER(13,0),																																						
	ABA0225_SB_TRANS_REF VARCHAR2(8 BYTE),																																						
	ABA0225_SB_TRANS_TYPE VARCHAR2(3 BYTE),																																						
	ABA0225_SB_RECEIVED_DT NUMBER(8,0),																																						
	ABA0225_SB_RECEIVED_TIME NUMBER(6,0),																																						
	ABA0225_SB_NOMINAL_AMT NUMBER(11,0),																																						
	ABA0225_SB_COMP_NOCOMP VARCHAR2(1 BYTE),																																						
	ABA0225_SB_BID_YIELD_SIGN VARCHAR2(1 BYTE),																																						
	ABA0225_SB_BID_YIELD NUMBER(5,0),																																						
	ABA0225_SB_CDP_ACCT_NO VARCHAR2(16 BYTE),																																						
	ABA0225_SB_CPFIS_SRS_ACCT_NO VARCHAR2(16 BYTE),																																						
	ABA0225_SB_CUST_BANK_CODE NUMBER(4,0),																																						
	ABA0225_SB_CUST_BANK_BC VARCHAR2(1 BYTE),																																						
	ABA0225_SB_CURR VARCHAR2(3 BYTE),																																						
	ABA0225_SB_TYPE_OF_APPLN VARCHAR2(3 BYTE),																																						
	ABA0225_SB_SUB_METHOD VARCHAR2(1 BYTE),																																						
	ABA0225_SB_ISSUE_DESC VARCHAR2(30 BYTE),																																						
	ABA0225_SB_FILLER VARCHAR2(20 BYTE),																																						
	ABA0225_SB_CD_RECORD_STATUS VARCHAR2(1 BYTE),																																						
	ABA0225_SB_DELETED_DT DATE,																																						
	ABA0225_SB_LINE_NUMBER NUMBER(8,0),																																						
	ABA0225_SB_CREATED_DT TIMESTAMP (6) DEFAULT CURRENT_TIMESTAMP,																																						
	ABA0225_SB_LAST_MODIFIED_DT TIMESTAMP (6) DEFAULT CURRENT_TIMESTAMP																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table ABA0225_SB_SUBSCRIPT_DT_BKUP																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."ABA0225_SB_SUBSCRIPT_DT_BKUP"																																							
(	ABA0225_SB_SUB_DETAIL_ID NUMBER(19,0),																																						
	ABA0225_SB_SUB_ID NUMBER(19,0),																																						
	ABA0225_SB_APPLICANT_ID NUMBER(19,0),																																						
	ABA0225_SB_REFERENCE_NO NUMBER(13,0),																																						
	ABA0225_SB_TRANS_REF VARCHAR2(8 BYTE),																																						
	ABA0225_SB_TRANS_TYPE VARCHAR2(3 BYTE),																																						
	ABA0225_SB_RECEIVED_DT NUMBER(8,0),																																						
	ABA0225_SB_RECEIVED_TIME NUMBER(6,0),																																						
	ABA0225_SB_NOMINAL_AMT NUMBER(11,0),																																						
	ABA0225_SB_COMP_NOCOMP VARCHAR2(1 BYTE),																																						
	ABA0225_SB_BID_YIELD_SIGN VARCHAR2(1 BYTE),																																						
	ABA0225_SB_BID_YIELD NUMBER(5,0),																																						
	ABA0225_SB_CDP_ACCT_NO VARCHAR2(16 BYTE),																																						
	ABA0225_SB_CPFIS_SRS_ACCT_NO VARCHAR2(16 BYTE),																																						
	ABA0225_SB_CUST_BANK_CODE NUMBER(4,0),																																						
	ABA0225_SB_CUST_BANK_BC VARCHAR2(1 BYTE),																																						
	ABA0225_SB_CURR VARCHAR2(3 BYTE),																																						
	ABA0225_SB_TYPE_OF_APPLN VARCHAR2(3 BYTE),																																						
	ABA0225_SB_SUB_METHOD VARCHAR2(1 BYTE),																																						
	ABA0225_SB_ISSUE_DESC VARCHAR2(30 BYTE),																																						
	ABA0225_SB_FILLER VARCHAR2(20 BYTE),																																						
	ABA0225_SB_CD_RECORD_STATUS VARCHAR2(1 BYTE),																																						
	ABA0225_SB_DELETED_DT DATE,																																						
	ABA0225_SB_LINE_NUMBER NUMBER(8,0),																																						
	ABA0225_SB_CREATED_DT TIMESTAMP (6),																																						
	ABA0225_SB_LAST_MODIFIED_DT TIMESTAMP (6)																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table ABA0226_SB_SUBSCRIPT_DT_ERR																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."ABA0226_SB_SUBSCRIPT_DT_ERR"																																							
(	ABA0226_SB_SUB_DT_ERR_ID NUMBER(19,0),																																						
	ABA0226_SB_SUB_ID NUMBER(19,0),																																						
	ABA0226_SB_SECURITY_CODE VARCHAR2(8 BYTE),																																						
	ABA0226_SB_TRANS_REF VARCHAR2(8 BYTE),																																						
	ABA0226_SB_TRANS_TYPE VARCHAR2(3 BYTE),																																						
	ABA0226_SB_RECEIVED_DT NUMBER(8,0),																																						
	ABA0226_SB_RECEIVED_TIME NUMBER(6,0),																																						
	ABA0226_SB_NOMINAL_AMT NUMBER(11,0),																																						
	ABA0226_SB_COMP_NOCOMP VARCHAR2(1 BYTE),																																						
	ABA0226_SB_BID_YIELD_SIGN VARCHAR2(1 BYTE),																																						
	ABA0226_SB_BID_YIELD NUMBER(5,0),																																						
	ABA0226_SB_IC_PASSPORT VARCHAR2(14 BYTE),																																						
	ABA0226_SB_NAME_OF_APPLN VARCHAR2(100 BYTE),																																						
	ABA0226_SB_CD_NATION VARCHAR2(1 BYTE),																																						
	ABA0226_SB_CD_NATION_CTY VARCHAR2(2 BYTE),																																						
	ABA0226_SB_CDP_ACCT_NO VARCHAR2(16 BYTE),																																						
	ABA0226_SB_CPFIS_SRS_ACCT_NO VARCHAR2(16 BYTE),																																						
	ABA0226_SB_CUST_BANK_CODE NUMBER(4,0),																																						
	ABA0226_SB_CUST_BANK_BC VARCHAR2(1 BYTE),																																						
	ABA0226_SB_TYPE_OF_APPLN VARCHAR2(3 BYTE),																																						
	ABA0226_SB_SUB_METHOD VARCHAR2(1 BYTE),																																						
	ABA0226_SB_FILLER VARCHAR2(20 BYTE),																																						
	ABA0226_SB_CD_RECORD_ERR_DESC VARCHAR2(3 BYTE),																																						
	ABA0226_SB_DELETED_DT DATE,																																						
	ABA0226_SB_LINE_NUMBER NUMBER(8,0),																																						
	ABA0226_SB_CREATED_DT TIMESTAMP (6) DEFAULT CURRENT_TIMESTAMP,																																						
	ABA0226_SB_LAST_MODIFIED_DT TIMESTAMP (6) DEFAULT CURRENT_TIMESTAMP																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table ABA0226_SB_SUBSCRIPT_DT_ERR_BKUP																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."ABA0226_SB_SUBSCRIPT_DT_ERR_BKUP"																																							
(	ABA0226_SB_SUB_DT_ERR_ID NUMBER(19,0),																																						
	ABA0226_SB_SUB_ID NUMBER(19,0),																																						
	ABA0226_SB_SECURITY_CODE VARCHAR2(8 BYTE),																																						
	ABA0226_SB_TRANS_REF VARCHAR2(8 BYTE),																																						
	ABA0226_SB_TRANS_TYPE VARCHAR2(3 BYTE),																																						
	ABA0226_SB_RECEIVED_DT NUMBER(8,0),																																						
	ABA0226_SB_RECEIVED_TIME NUMBER(6,0),																																						
	ABA0226_SB_NOMINAL_AMT NUMBER(11,0),																																						
	ABA0226_SB_COMP_NOCOMP VARCHAR2(1 BYTE),																																						
	ABA0226_SB_BID_YIELD_SIGN VARCHAR2(1 BYTE),																																						
	ABA0226_SB_BID_YIELD NUMBER(5,0),																																						
	ABA0226_SB_IC_PASSPORT VARCHAR2(14 BYTE),																																						
	ABA0226_SB_NAME_OF_APPLN VARCHAR2(100 BYTE),																																						
	ABA0226_SB_CD_NATION VARCHAR2(1 BYTE),																																						
	ABA0226_SB_CD_NATION_CTY VARCHAR2(2 BYTE),																																						
	ABA0226_SB_CDP_ACCT_NO VARCHAR2(16 BYTE),																																						
	ABA0226_SB_CPFIS_SRS_ACCT_NO VARCHAR2(16 BYTE),																																						
	ABA0226_SB_CUST_BANK_CODE NUMBER(4,0),																																						
	ABA0226_SB_CUST_BANK_BC VARCHAR2(1 BYTE),																																						
	ABA0226_SB_TYPE_OF_APPLN VARCHAR2(3 BYTE),																																						
	ABA0226_SB_SUB_METHOD VARCHAR2(1 BYTE),																																						
	ABA0226_SB_FILLER VARCHAR2(20 BYTE),																																						
	ABA0226_SB_CD_RECORD_ERR_DESC VARCHAR2(3 BYTE),																																						
	ABA0226_SB_DELETED_DT DATE,																																						
	ABA0226_SB_LINE_NUMBER NUMBER(8,0),																																						
	ABA0226_SB_CREATED_DT TIMESTAMP (6),																																						
	ABA0226_SB_LAST_MODIFIED_DT TIMESTAMP (6)																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table ABA0227_SB_REDEMPTION																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."ABA0227_SB_REDEMPTION"																																							
(	ABA0227_SB_REDEM_ID NUMBER(19,0),																																						
	ABA0227_SB_BATCH_JOB_ID NUMBER(19,0),																																						
	ABA0227_SB_ORG_ID NUMBER(19,0),																																						
	ABA0227_SB_CD_FILE_TYPE VARCHAR2(3 BYTE),																																						
	ABA0227_SB_CD_FILE_STATUS VARCHAR2(1 BYTE),																																						
	ABA0227_SB_CD_FILE_ERR_DESC VARCHAR2(3 BYTE),																																						
	ABA0227_SB_RECORD_COUNT NUMBER(8,0),																																						
	ABA0227_SB_FILE_NAME VARCHAR2(100 BYTE),																																						
	ABA0227_SB_ACKNOWLEDGED_DT DATE,																																						
	ABA0227_SB_PROCESS_DT NUMBER(8,0),																																						
	ABA0227_SB_DELETED_DT DATE,																																						
	ABA0227_SB_CREATED_DT TIMESTAMP (6) DEFAULT CURRENT_TIMESTAMP,																																						
	ABA0227_SB_LAST_MODIFIED_DT TIMESTAMP (6) DEFAULT CURRENT_TIMESTAMP																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table ABA0227_SB_REDEMPTION_BKUP																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."ABA0227_SB_REDEMPTION_BKUP"																																							
(	ABA0227_SB_REDEM_ID NUMBER(19,0),																																						
	ABA0227_SB_BATCH_JOB_ID NUMBER(19,0),																																						
	ABA0227_SB_ORG_ID NUMBER(19,0),																																						
	ABA0227_SB_CD_FILE_TYPE VARCHAR2(3 BYTE),																																						
	ABA0227_SB_CD_FILE_STATUS VARCHAR2(1 BYTE),																																						
	ABA0227_SB_CD_FILE_ERR_DESC VARCHAR2(3 BYTE),																																						
	ABA0227_SB_RECORD_COUNT NUMBER(8,0),																																						
	ABA0227_SB_FILE_NAME VARCHAR2(100 BYTE),																																						
	ABA0227_SB_ACKNOWLEDGED_DT DATE,																																						
	ABA0227_SB_PROCESS_DT NUMBER(8,0),																																						
	ABA0227_SB_DELETED_DT DATE,																																						
	ABA0227_SB_CREATED_DT TIMESTAMP (6),																																						
	ABA0227_SB_LAST_MODIFIED_DT TIMESTAMP (6)																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table ABA0228_SB_REDEMPTION_DT																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."ABA0228_SB_REDEMPTION_DT"																																							
(	ABA0228_SB_REDEM_DT_ID NUMBER(19,0),																																						
	ABA0228_SB_REDEM_ID NUMBER(19,0),																																						
	ABA0228_SB_APPLICANT_ID NUMBER(19,0),																																						
	ABA0228_SB_ORG_ID NUMBER(19,0),																																						
	ABA0228_SB_SECURITY_CODE VARCHAR2(8 BYTE),																																						
	ABA0228_SB_ISIN_CODE VARCHAR2(12 BYTE),																																						
	ABA0228_SB_TRANS_REF VARCHAR2(8 BYTE),																																						
	ABA0228_SB_RECEIVED_DT NUMBER(8,0),																																						
	ABA0228_SB_RECEIVED_TIME NUMBER(6,0),																																						
	ABA0228_SB_NOMINAL_AMT NUMBER(11,0),																																						
	ABA0228_SB_BID_YIELD_SIGN VARCHAR2(1 BYTE),																																						
	ABA0228_SB_BID_YIELD NUMBER(5,0),																																						
	ABA0228_SB_COMP_NOCOMP VARCHAR2(1 BYTE),																																						
	ABA0228_SB_CDP_ACCT_NO VARCHAR2(16 BYTE),																																						
	ABA0228_SB_CPFIS_SRS_ACCT_NO VARCHAR2(16 BYTE),																																						
	ABA0228_SB_CUST_BANK_BC VARCHAR2(1 BYTE),																																						
	ABA0228_SB_CUST_BANK_CODE NUMBER(4,0),																																						
	ABA0228_SB_TYPE_OF_APPLN VARCHAR2(3 BYTE),																																						
	ABA0228_SB_SUB_METHOD VARCHAR2(1 BYTE),																																						
	ABA0228_SB_FILLER VARCHAR2(20 BYTE),																																						
	ABA0228_SB_REDEM_PROCESS_DT DATE,																																						
	ABA0228_SB_RELEASED_DT DATE,																																						
	ABA0228_SB_CD_RECORD_STATUS VARCHAR2(1 BYTE),																																						
	ABA0228_SB_DELETED_DT DATE,																																						
	ABA0228_SB_LINE_NUMBER NUMBER(10,0),																																						
	ABA0228_SB_CREATED_DT TIMESTAMP (6) DEFAULT CURRENT_TIMESTAMP,																																						
	ABA0228_SB_LAST_MODIFIED_DT TIMESTAMP (6) DEFAULT CURRENT_TIMESTAMP																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table ABA0228_SB_REDEMPTION_DT_BKUP																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."ABA0228_SB_REDEMPTION_DT_BKUP"																																							
(	ABA0228_SB_REDEM_DT_ID NUMBER(19,0),																																						
	ABA0228_SB_REDEM_ID NUMBER(19,0),																																						
	ABA0228_SB_APPLICANT_ID NUMBER(19,0),																																						
	ABA0228_SB_ORG_ID NUMBER(19,0),																																						
	ABA0228_SB_SECURITY_CODE VARCHAR2(8 BYTE),																																						
	ABA0228_SB_ISIN_CODE VARCHAR2(12 BYTE),																																						
	ABA0228_SB_TRANS_REF VARCHAR2(8 BYTE),																																						
	ABA0228_SB_RECEIVED_DT NUMBER(8,0),																																						
	ABA0228_SB_RECEIVED_TIME NUMBER(6,0),																																						
	ABA0228_SB_NOMINAL_AMT NUMBER(11,0),																																						
	ABA0228_SB_BID_YIELD_SIGN VARCHAR2(1 BYTE),																																						
	ABA0228_SB_BID_YIELD NUMBER(5,0),																																						
	ABA0228_SB_COMP_NOCOMP VARCHAR2(1 BYTE),																																						
	ABA0228_SB_CDP_ACCT_NO VARCHAR2(16 BYTE),																																						
	ABA0228_SB_CPFIS_SRS_ACCT_NO VARCHAR2(16 BYTE),																																						
	ABA0228_SB_CUST_BANK_BC VARCHAR2(1 BYTE),																																						
	ABA0228_SB_CUST_BANK_CODE NUMBER(4,0),																																						
	ABA0228_SB_TYPE_OF_APPLN VARCHAR2(3 BYTE),																																						
	ABA0228_SB_SUB_METHOD VARCHAR2(1 BYTE),																																						
	ABA0228_SB_FILLER VARCHAR2(20 BYTE),																																						
	ABA0228_SB_REDEM_PROCESS_DT DATE,																																						
	ABA0228_SB_RELEASED_DT DATE,																																						
	ABA0228_SB_CD_RECORD_STATUS VARCHAR2(1 BYTE),																																						
	ABA0228_SB_DELETED_DT DATE,																																						
	ABA0228_SB_LINE_NUMBER NUMBER(10,0),																																						
	ABA0228_SB_CREATED_DT TIMESTAMP (6),																																						
	ABA0228_SB_LAST_MODIFIED_DT TIMESTAMP (6)																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table ABA0229_SB_REDEMPTION_DT_ERR																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."ABA0229_SB_REDEMPTION_DT_ERR"																																							
(	ABA0229_SB_REDEM_DT_ERR_ID NUMBER(19,0),																																						
	ABA0229_SB_REDEM_ID NUMBER(19,0),																																						
	ABA0229_SB_SECURITY_CODE VARCHAR2(8 BYTE),																																						
	ABA0229_SB_ISIN_CODE VARCHAR2(12 BYTE),																																						
	ABA0229_SB_TRANS_REF VARCHAR2(8 BYTE),																																						
	ABA0229_SB_RECEIVED_DT NUMBER(8,0),																																						
	ABA0229_SB_RECEIVED_TIME NUMBER(6,0),																																						
	ABA0229_SB_NOMINAL_AMT NUMBER(11,0),																																						
	ABA0229_SB_COMP_NOCOMP VARCHAR2(1 BYTE),																																						
	ABA0229_SB_BID_YIELD_SIGN VARCHAR2(1 BYTE),																																						
	ABA0229_SB_BID_YIELD NUMBER(5,0),																																						
	ABA0229_SB_IC_PASSPORT VARCHAR2(14 BYTE),																																						
	ABA0229_SB_NAME_OF_APPLN VARCHAR2(100 BYTE),																																						
	ABA0229_SB_CD_NATION VARCHAR2(1 BYTE),																																						
	ABA0229_SB_CD_NATION_CTY VARCHAR2(2 BYTE),																																						
	ABA0229_SB_CDP_ACCT_NO VARCHAR2(16 BYTE),																																						
	ABA0229_SB_CPFIS_SRS_ACCT_NO VARCHAR2(16 BYTE),																																						
	ABA0229_SB_CUST_BANK_CODE NUMBER(4,0),																																						
	ABA0229_SB_CUST_BANK_BC VARCHAR2(1 BYTE),																																						
	ABA0229_SB_TYPE_OF_APPLN VARCHAR2(3 BYTE),																																						
	ABA0229_SB_SUB_METHOD VARCHAR2(1 BYTE),																																						
	ABA0229_SB_FILLER VARCHAR2(20 BYTE),																																						
	ABA0229_SB_REDEM_PROCESS_DT DATE,																																						
	ABA0229_SB_RELEASED_DT DATE,																																						
	ABA0229_SB_CD_RECORD_ERR_DESC VARCHAR2(3 BYTE),																																						
	ABA0229_SB_DELETED_DT DATE,																																						
	ABA0229_SB_LINE_NUMBER NUMBER(10,0),																																						
	ABA0229_SB_CREATED_DT TIMESTAMP (6) DEFAULT CURRENT_TIMESTAMP,																																						
	ABA0229_SB_LAST_MODIFIED_DT TIMESTAMP (6) DEFAULT CURRENT_TIMESTAMP																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table ABA0229_SB_REDEMPTION_DT_ERR_BKUP																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."ABA0229_SB_REDEMPTION_DT_ERR_BKUP"																																							
(	ABA0229_SB_REDEM_DT_ERR_ID NUMBER(19,0),																																						
	ABA0229_SB_REDEM_ID NUMBER(19,0),																																						
	ABA0229_SB_SECURITY_CODE VARCHAR2(8 BYTE),																																						
	ABA0229_SB_ISIN_CODE VARCHAR2(12 BYTE),																																						
	ABA0229_SB_TRANS_REF VARCHAR2(8 BYTE),																																						
	ABA0229_SB_RECEIVED_DT NUMBER(8,0),																																						
	ABA0229_SB_RECEIVED_TIME NUMBER(6,0),																																						
	ABA0229_SB_NOMINAL_AMT NUMBER(11,0),																																						
	ABA0229_SB_COMP_NOCOMP VARCHAR2(1 BYTE),																																						
	ABA0229_SB_BID_YIELD_SIGN VARCHAR2(1 BYTE),																																						
	ABA0229_SB_BID_YIELD NUMBER(5,0),																																						
	ABA0229_SB_IC_PASSPORT VARCHAR2(14 BYTE),																																						
	ABA0229_SB_NAME_OF_APPLN VARCHAR2(100 BYTE),																																						
	ABA0229_SB_CD_NATION VARCHAR2(1 BYTE),																																						
	ABA0229_SB_CD_NATION_CTY VARCHAR2(2 BYTE),																																						
	ABA0229_SB_CDP_ACCT_NO VARCHAR2(16 BYTE),																																						
	ABA0229_SB_CPFIS_SRS_ACCT_NO VARCHAR2(16 BYTE),																																						
	ABA0229_SB_CUST_BANK_CODE NUMBER(4,0),																																						
	ABA0229_SB_CUST_BANK_BC VARCHAR2(1 BYTE),																																						
	ABA0229_SB_TYPE_OF_APPLN VARCHAR2(3 BYTE),																																						
	ABA0229_SB_SUB_METHOD VARCHAR2(1 BYTE),																																						
	ABA0229_SB_FILLER VARCHAR2(20 BYTE),																																						
	ABA0229_SB_REDEM_PROCESS_DT DATE,																																						
	ABA0229_SB_RELEASED_DT DATE,																																						
	ABA0229_SB_CD_RECORD_ERR_DESC VARCHAR2(3 BYTE),																																						
	ABA0229_SB_DELETED_DT DATE,																																						
	ABA0229_SB_LINE_NUMBER NUMBER(10,0),																																						
	ABA0229_SB_CREATED_DT TIMESTAMP (6),																																						
	ABA0229_SB_LAST_MODIFIED_DT TIMESTAMP (6)																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table ABA0230_SB_HLD_INFO																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."ABA0230_SB_HLD_INFO"																																							
(	ABA0230_SB_HLD_INFO_ID NUMBER(19,0),																																						
	ABA0230_SB_BATCH_JOB_ID NUMBER(19,0),																																						
	ABA0230_SB_ORG_ID NUMBER(19,0),																																						
	ABA0230_SB_CD_FILE_TYPE VARCHAR2(3 BYTE),																																						
	ABA0230_SB_CD_FILE_STATUS VARCHAR2(1 BYTE),																																						
	ABA0230_SB_CD_FILE_ERR_DESC VARCHAR2(3 BYTE),																																						
	ABA0230_SB_FILE_NAME VARCHAR2(100 BYTE),																																						
	ABA0230_SB_HLD_TYPE VARCHAR2(3 BYTE),																																						
	ABA0230_SB_PROCESS_DT NUMBER(8,0),																																						
	ABA0230_SB_PROCESS_TIME NUMBER(6,0),																																						
	ABA0230_SB_RECORD_COUNT NUMBER(8,0),																																						
	ABA0230_SB_CREATED_DT TIMESTAMP (6) DEFAULT CURRENT_TIMESTAMP,																																						
	ABA0230_SB_LAST_MODIFIED_DT TIMESTAMP (6) DEFAULT CURRENT_TIMESTAMP																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table ABA0230_SB_HLD_INFO_BKUP																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."ABA0230_SB_HLD_INFO_BKUP"																																							
(	ABA0230_SB_HLD_INFO_ID NUMBER(19,0),																																						
	ABA0230_SB_BATCH_JOB_ID NUMBER(19,0),																																						
	ABA0230_SB_ORG_ID NUMBER(19,0),																																						
	ABA0230_SB_CD_FILE_TYPE VARCHAR2(3 BYTE),																																						
	ABA0230_SB_CD_FILE_STATUS VARCHAR2(1 BYTE),																																						
	ABA0230_SB_CD_FILE_ERR_DESC VARCHAR2(3 BYTE),																																						
	ABA0230_SB_FILE_NAME VARCHAR2(100 BYTE),																																						
	ABA0230_SB_HLD_TYPE VARCHAR2(3 BYTE),																																						
	ABA0230_SB_PROCESS_DT NUMBER(8,0),																																						
	ABA0230_SB_PROCESS_TIME NUMBER(6,0),																																						
	ABA0230_SB_RECORD_COUNT NUMBER(8,0),																																						
	ABA0230_SB_CREATED_DT TIMESTAMP (6),																																						
	ABA0230_SB_LAST_MODIFIED_DT TIMESTAMP (6)																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table ABA0231_SB_HLD_INFO_DT																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."ABA0231_SB_HLD_INFO_DT"																																							
(	ABA0231_SB_HLD_INFO_DT_ID NUMBER(19,0),																																						
	ABA0231_SB_HLD_INFO_ID NUMBER(19,0),																																						
	ABA0231_SB_APPLICANT_ID NUMBER(19,0),																																						
	ABA0231_SB_SECURITY_CODE VARCHAR2(8 BYTE),																																						
	ABA0231_SB_ISIN_CODE VARCHAR2(12 BYTE),																																						
	ABA0231_SB_CDP_ACCT_NO VARCHAR2(16 BYTE),																																						
	ABA0231_SB_CPFIS_SRS_ACCT_NO VARCHAR2(16 BYTE),																																						
	ABA0231_SB_HLD_AMT NUMBER(14,0),																																						
	ABA0231_SB_CREATED_DT TIMESTAMP (6) DEFAULT CURRENT_TIMESTAMP,																																						
	ABA0231_SB_LAST_MODIFIED_DT TIMESTAMP (6) DEFAULT CURRENT_TIMESTAMP																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table ABA0231_SB_HLD_INFO_DT_BACKUP																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."ABA0231_SB_HLD_INFO_DT_BACKUP"																																							
(	ABA0231_SB_HLD_INFO_DT_ID NUMBER(19,0),																																						
	ABA0231_SB_HLD_INFO_ID NUMBER(19,0),																																						
	ABA0231_SB_APPLICANT_ID NUMBER(19,0),																																						
	ABA0231_SB_SECURITY_CODE VARCHAR2(8 BYTE),																																						
	ABA0231_SB_ISIN_CODE VARCHAR2(12 BYTE),																																						
	ABA0231_SB_CDP_ACCT_NO VARCHAR2(16 BYTE),																																						
	ABA0231_SB_CPFIS_SRS_ACCT_NO VARCHAR2(16 BYTE),																																						
	ABA0231_SB_HLD_AMT NUMBER(14,0),																																						
	ABA0231_SB_CREATED_DT TIMESTAMP (6) DEFAULT CURRENT_TIMESTAMP,																																						
	ABA0231_SB_LAST_MODIFIED_DT TIMESTAMP (6) DEFAULT CURRENT_TIMESTAMP																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table ABA0231_SB_HLD_INFO_DT_BKUP																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."ABA0231_SB_HLD_INFO_DT_BKUP"																																							
(	ABA0231_SB_HLD_INFO_DT_ID NUMBER(19,0),																																						
	ABA0231_SB_HLD_INFO_ID NUMBER(19,0),																																						
	ABA0231_SB_APPLICANT_ID NUMBER(19,0),																																						
	ABA0231_SB_SECURITY_CODE VARCHAR2(8 BYTE),																																						
	ABA0231_SB_ISIN_CODE VARCHAR2(12 BYTE),																																						
	ABA0231_SB_CDP_ACCT_NO VARCHAR2(16 BYTE),																																						
	ABA0231_SB_CPFIS_SRS_ACCT_NO VARCHAR2(16 BYTE),																																						
	ABA0231_SB_HLD_AMT NUMBER(14,0),																																						
	ABA0231_SB_CREATED_DT TIMESTAMP (6) DEFAULT CURRENT_TIMESTAMP,																																						
	ABA0231_SB_LAST_MODIFIED_DT TIMESTAMP (6) DEFAULT CURRENT_TIMESTAMP																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table ABA0232_SB_ALLOTMENT_RESULT																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."ABA0232_SB_ALLOTMENT_RESULT"																																							
(	ABA0232_SB_ALLOT_RESULT_ID NUMBER(19,0),																																						
	ABA0232_SB_BATCH_JOB_ID NUMBER(19,0),																																						
	ABA0232_SB_SUB_DETAIL_ID NUMBER(19,0),																																						
	ABA0232_SB_RELEASED_DT DATE,																																						
	ABA0232_SB_ACCEPTED_AMT NUMBER(11,0),																																						
	ABA0232_SB_PROCESSED_AMT NUMBER(11,0),																																						
	ABA0232_SB_CD_RECORD_STATUS VARCHAR2(1 BYTE),																																						
	ABA0232_SB_CD_RECORD_ERR_DESC VARCHAR2(3 BYTE),																																						
	ABA0232_SB_CREATED_DT TIMESTAMP (6) DEFAULT CURRENT_TIMESTAMP,																																						
	ABA0232_SB_LAST_MODIFIED_DT TIMESTAMP (6) DEFAULT CURRENT_TIMESTAMP																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table ABA0232_SB_ALLOTMENT_RESULT_BKUP																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."ABA0232_SB_ALLOTMENT_RESULT_BKUP"																																							
(	ABA0232_SB_ALLOT_RESULT_ID NUMBER(19,0),																																						
	ABA0232_SB_BATCH_JOB_ID NUMBER(19,0),																																						
	ABA0232_SB_SUB_DETAIL_ID NUMBER(19,0),																																						
	ABA0232_SB_RELEASED_DT DATE,																																						
	ABA0232_SB_ACCEPTED_AMT NUMBER(11,0),																																						
	ABA0232_SB_PROCESSED_AMT NUMBER(11,0),																																						
	ABA0232_SB_CD_RECORD_STATUS VARCHAR2(1 BYTE),																																						
	ABA0232_SB_CD_RECORD_ERR_DESC VARCHAR2(3 BYTE),																																						
	ABA0232_SB_CREATED_DT TIMESTAMP (6),																																						
	ABA0232_SB_LAST_MODIFIED_DT TIMESTAMP (6)																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table ABA0233_SB_BATCH_JOB																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."ABA0233_SB_BATCH_JOB"																																							
(	ABA0233_SB_JOB_ID NUMBER(19,0),																																						
	ABA0233_SB_JOB_TYPE VARCHAR2(100 BYTE),																																						
	ABA0233_SB_JOB_INSTANCE_ID NUMBER(19,0),																																						
	ABA0233_SB_JOB_STATUS VARCHAR2(1 BYTE),																																						
	ABA0233_SB_CREATED_DT DATE																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table ABA0233_SB_BATCH_JOB_BKUP																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."ABA0233_SB_BATCH_JOB_BKUP"																																							
(	ABA0233_SB_JOB_ID NUMBER(19,0),																																						
	ABA0233_SB_JOB_TYPE VARCHAR2(100 BYTE),																																						
	ABA0233_SB_JOB_INSTANCE_ID NUMBER(19,0),																																						
	ABA0233_SB_JOB_STATUS VARCHAR2(1 BYTE),																																						
	ABA0233_SB_CREATED_DT DATE																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table ABA0234_SB_BATCH_JOB_EXECUTION																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."ABA0234_SB_BATCH_JOB_EXECUTION"																																							
(	ABA0234_SB_JOB_EXECUTION_ID NUMBER(19,0),																																						
	ABA0234_SB_JOB_ID NUMBER(19,0),																																						
	ABA0234_SB_JOB_STEP NUMBER(10,0),																																						
	ABA0234_SB_STEP_STATUS VARCHAR2(1 BYTE),																																						
	ABA0234_SB_ORG_CODE NUMBER(4,0),																																						
	ABA0234_SB_PROCESSED_RECORDS NUMBER(19,0),																																						
	ABA0234_SB_REMARKS VARCHAR2(255 BYTE),																																						
	ABA0234_SB_CREATED_DT TIMESTAMP (6) DEFAULT CURRENT_TIMESTAMP,																																						
	ABA0234_APPLICATION_TYPE VARCHAR2(4 BYTE)																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table ABA0234_SB_BATCH_JOB_EXECUTION_BKUP																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."ABA0234_SB_BATCH_JOB_EXECUTION_BKUP"																																							
(	ABA0234_SB_JOB_EXECUTION_ID NUMBER(19,0),																																						
	ABA0234_SB_JOB_ID NUMBER(19,0),																																						
	ABA0234_SB_JOB_STEP NUMBER(10,0),																																						
	ABA0234_SB_STEP_STATUS VARCHAR2(1 BYTE),																																						
	ABA0234_SB_ORG_CODE NUMBER(4,0),																																						
	ABA0234_SB_PROCESSED_RECORDS NUMBER(19,0),																																						
	ABA0234_SB_REMARKS VARCHAR2(255 BYTE),																																						
	ABA0234_SB_CREATED_DT TIMESTAMP (6),																																						
	ABA0234_APPLICATION_TYPE VARCHAR2(4 BYTE)																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table ABA0235_SB_SUBMISSION_SUMMARY																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."ABA0235_SB_SUBMISSION_SUMMARY"																																							
(	ABA0235_SB_SUBMISSION_SUM_ID NUMBER(19,0),																																						
	ABA0235_SB_JOB_ID NUMBER(19,0),																																						
	ABA0235_SB_ORG_ID NUMBER(19,0),																																						
	ABA0235_SB_SECURITY_CODE VARCHAR2(8 BYTE),																																						
	ABA0235_SB_CD_FILE_TYPE VARCHAR2(3 BYTE),																																						
	ABA0235_SB_QTY_REJECTED NUMBER(8,0),																																						
	ABA0235_SB_QTY_SUBMITTED NUMBER(8,0),																																						
	ABA0235_SB_QTY_SUCCESS NUMBER(8,0),																																						
	ABA0235_SB_TOTAL_AMT_SUBMIT NUMBER(13,0),																																						
	ABA0235_SB_TOTAL_AMT_SUCCESS NUMBER(13,0),																																						
	ABA0235_SB_CREATED_DT TIMESTAMP (6) DEFAULT CURRENT_TIMESTAMP																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table ABA0235_SB_SUBMISSION_SUMMARY_BKUP																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."ABA0235_SB_SUBMISSION_SUMMARY_BKUP"																																							
(	ABA0235_SB_SUBMISSION_SUM_ID NUMBER(19,0),																																						
	ABA0235_SB_JOB_ID NUMBER(19,0),																																						
	ABA0235_SB_ORG_ID NUMBER(19,0),																																						
	ABA0235_SB_SECURITY_CODE VARCHAR2(8 BYTE),																																						
	ABA0235_SB_CD_FILE_TYPE VARCHAR2(3 BYTE),																																						
	ABA0235_SB_QTY_REJECTED NUMBER(8,0),																																						
	ABA0235_SB_QTY_SUBMITTED NUMBER(8,0),																																						
	ABA0235_SB_QTY_SUCCESS NUMBER(8,0),																																						
	ABA0235_SB_TOTAL_AMT_SUBMIT NUMBER(13,0),																																						
	ABA0235_SB_TOTAL_AMT_SUCCESS NUMBER(13,0),																																						
	ABA0235_SB_CREATED_DT TIMESTAMP (6)																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table ABA0236_SB_HLD_INFO_DT_ERR																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."ABA0236_SB_HLD_INFO_DT_ERR"																																							
(	ABA0236_SB_HLD_INFO_DT_ERR_ID NUMBER(19,0),																																						
	ABA0236_SB_HLD_INFO_ID NUMBER(19,0),																																						
	ABA0236_SB_SECURITY_CODE VARCHAR2(8 BYTE),																																						
	ABA0236_SB_ISIN_CODE VARCHAR2(12 BYTE),																																						
	ABA0236_SB_IC_PASSPORT VARCHAR2(14 BYTE),																																						
	ABA0236_SB_NAME_OF_APPLN VARCHAR2(100 BYTE),																																						
	ABA0236_SB_CDP_ACCT_NO VARCHAR2(16 BYTE),																																						
	ABA0236_SB_CD_NATION VARCHAR2(1 BYTE),																																						
	ABA0236_SB_CD_NATION_CTY VARCHAR2(2 BYTE),																																						
	ABA0236_SB_CPFIS_SRS_ACCT_NO VARCHAR2(16 BYTE),																																						
	ABA0236_SB_HLD_AMT NUMBER(14,0),																																						
	ABA0236_SB_CD_RECORD_ERR_DESC VARCHAR2(3 BYTE),																																						
	ABA0236_SB_CREATED_DT TIMESTAMP (6) DEFAULT CURRENT_TIMESTAMP,																																						
	ABA0236_SB_LAST_MODIFIED_DT TIMESTAMP (6) DEFAULT CURRENT_TIMESTAMP																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table ABA0236_SB_HLD_INFO_DT_ERR_BKUP																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."ABA0236_SB_HLD_INFO_DT_ERR_BKUP"																																							
(	ABA0236_SB_HLD_INFO_DT_ERR_ID NUMBER(19,0),																																						
	ABA0236_SB_HLD_INFO_ID NUMBER(19,0),																																						
	ABA0236_SB_SECURITY_CODE VARCHAR2(8 BYTE),																																						
	ABA0236_SB_ISIN_CODE VARCHAR2(12 BYTE),																																						
	ABA0236_SB_IC_PASSPORT VARCHAR2(14 BYTE),																																						
	ABA0236_SB_NAME_OF_APPLN VARCHAR2(100 BYTE),																																						
	ABA0236_SB_CDP_ACCT_NO VARCHAR2(16 BYTE),																																						
	ABA0236_SB_CD_NATION VARCHAR2(1 BYTE),																																						
	ABA0236_SB_CD_NATION_CTY VARCHAR2(2 BYTE),																																						
	ABA0236_SB_CPFIS_SRS_ACCT_NO VARCHAR2(16 BYTE),																																						
	ABA0236_SB_HLD_AMT NUMBER(14,0),																																						
	ABA0236_SB_CD_RECORD_ERR_DESC VARCHAR2(3 BYTE),																																						
	ABA0236_SB_CREATED_DT TIMESTAMP (6),																																						
	ABA0236_SB_LAST_MODIFIED_DT TIMESTAMP (6)																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table ABA0237_SB_USER																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."ABA0237_SB_USER"																																							
(	ABA0237_SB_USER_ID VARCHAR2(20 BYTE),																																						
	ABA0237_SB_LEVEL NUMBER(3,0),																																						
	ABA0237_SB_USER_LAST_LOGIN DATE																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table ABA0238_SB_LEVEL_ACTION																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."ABA0238_SB_LEVEL_ACTION"																																							
(	ABA0238_SB_MODULE VARCHAR2(100 BYTE),																																						
	ABA0238_SB_ACTION VARCHAR2(50 BYTE),																																						
	ABA0238_SB_LEVEL NUMBER(3,0)																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table ABA0239_SB_ACTION_REF																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."ABA0239_SB_ACTION_REF"																																							
(	ABA0239_SB_MODULE VARCHAR2(100 BYTE),																																						
	ABA0239_SB_ACTION VARCHAR2(50 BYTE),																																						
	ABA0239_SB_DESC VARCHAR2(300 BYTE)																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table ABA0240_SB_CD_SUBMISSION_TYPE																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."ABA0240_SB_CD_SUBMISSION_TYPE"																																							
(	ABA0240_SB_CD_SUBMIT_TYPE VARCHAR2(1 BYTE),																																						
	ABA0240_SB_DESCRIPTION VARCHAR2(100 BYTE)																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table ABA0241_SB_RESULT_FILE																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."ABA0241_SB_RESULT_FILE"																																							
(	ABA0241_SB_RESULT_FILE_ID NUMBER(19,0),																																						
	ABA0241_SB_JOB_TYPE VARCHAR2(100 BYTE),																																						
	ABA0241_SB_FILE_NAME VARCHAR2(50 BYTE),																																						
	ABA0241_SB_FILE_PATH VARCHAR2(255 BYTE),																																						
	ABA0241_SB_REFERENCE_NAME VARCHAR2(100 BYTE),																																						
	ABA0241_SB_REFERENCE_NUMBER NUMBER(19,0),																																						
	ABA0241_SB_CREATED_DT TIMESTAMP (6) DEFAULT CURRENT_TIMESTAMP																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table ABA0241_SB_RESULT_FILE_BKUP																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."ABA0241_SB_RESULT_FILE_BKUP"																																							
(	ABA0241_SB_RESULT_FILE_ID NUMBER(19,0),																																						
	ABA0241_SB_JOB_TYPE VARCHAR2(100 BYTE),																																						
	ABA0241_SB_FILE_NAME VARCHAR2(50 BYTE),																																						
	ABA0241_SB_FILE_PATH VARCHAR2(255 BYTE),																																						
	ABA0241_SB_REFERENCE_NAME VARCHAR2(100 BYTE),																																						
	ABA0241_SB_REFERENCE_NUMBER NUMBER(19,0),																																						
	ABA0241_SB_CREATED_DT TIMESTAMP (6)																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table ABA0250_SB_AUDIT_LOG																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."ABA0250_SB_AUDIT_LOG"																																							
(	ABA0250_SB_AUDIT_ID NUMBER(19,0),																																						
	ABA0250_SB_USER_ID VARCHAR2(25 BYTE),																																						
	ABA0250_SB_FUNCTION VARCHAR2(100 BYTE),																																						
	ABA0250_SB_DETAILS VARCHAR2(255 BYTE),																																						
	ABA0250_SB_CREATED_DT TIMESTAMP (6) DEFAULT CURRENT_TIMESTAMP																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table ABA0250_SB_AUDIT_LOG_BKUP																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."ABA0250_SB_AUDIT_LOG_BKUP"																																							
(	ABA0250_SB_AUDIT_ID NUMBER(19,0),																																						
	ABA0250_SB_USER_ID VARCHAR2(25 BYTE),																																						
	ABA0250_SB_FUNCTION VARCHAR2(100 BYTE),																																						
	ABA0250_SB_DETAILS VARCHAR2(255 BYTE),																																						
	ABA0250_SB_CREATED_DT TIMESTAMP (6)																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table ABA0251_SB_CONT_MAKE_CHECK																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."ABA0251_SB_CONT_MAKE_CHECK"																																							
(	ABA0251_ID NUMBER(19,0),																																						
	ABA0251_SB_BANK_CODE NUMBER(4,0),																																						
	ABA0251_SB_BANK_REF_NO VARCHAR2(8 BYTE),																																						
	ABA0251_SB_FILE_TYPE VARCHAR2(30 BYTE),																																						
	ABA0251_SB_IC_PASSPORT VARCHAR2(14 BYTE),																																						
	ABA0251_SB_ISSUE_CODE VARCHAR2(12 BYTE),																																						
	ABA0251_SB_RECORD_ID NUMBER(19,0),																																						
	ABA0251_SB_IDENTIFIER NUMBER(2,0),																																						
	ABA0251_SB_PROCESS_DT DATE,																																						
	ABA0251_SB_REQUEST_DT TIMESTAMP (6) DEFAULT CURRENT_TIMESTAMP,																																						
	ABA0251_SB_REQUESTOR VARCHAR2(25 BYTE),																																						
	ABA0251_SB_STATUS VARCHAR2(3 BYTE),																																						
	ABA0251_SB_LAST_MODIFIED_DT TIMESTAMP (6) DEFAULT CURRENT_TIMESTAMP,																																						
	ABA0251_SB_APPLICATION_TYPE VARCHAR2(5 BYTE)																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 3145728 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table ABA0252_SB_SYSCONF_MAKE_CHECK																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."ABA0252_SB_SYSCONF_MAKE_CHECK"																																							
(	ABA0252_SB_ID NUMBER(19,0),																																						
	ABA0252_SB_APPROVER VARCHAR2(25 BYTE),																																						
	ABA0252_SB_CREATED_DT TIMESTAMP (6) DEFAULT CURRENT_TIMESTAMP,																																						
	ABA0252_SB_CURRENT_VALUE VARCHAR2(25 BYTE),																																						
	ABA0252_SB_LIMIT VARCHAR2(30 BYTE),																																						
	ABA0252_SB_IDENTIFIER NUMBER(2,0),																																						
	ABA0252_SB_NEW_VALUE VARCHAR2(25 BYTE),																																						
	ABA0252_SB_REQUEST_DATE TIMESTAMP (6) DEFAULT CURRENT_TIMESTAMP,																																						
	ABA0252_SB_REQUESTER VARCHAR2(25 BYTE),																																						
	ABA0252_SB_STATUS VARCHAR2(3 BYTE),																																						
	ABA0252_SB_TYPE VARCHAR2(25 BYTE),																																						
	ABA0252_SB_LAST_MODIFIED_DT TIMESTAMP (6) DEFAULT CURRENT_TIMESTAMP																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table ABA0280_SB_TEMP_APP_SUB_DT																																							
--------------------------------------------------------																																							
																																							
CREATE GLOBAL TEMPORARY TABLE "MS9ABA"."ABA0280_SB_TEMP_APP_SUB_DT"																																							
(	ABA0280_SB_IC_PASSPORT VARCHAR2(14 BYTE),																																						
	ABA0280_SB_SECURITY_CODE VARCHAR2(8 BYTE),																																						
	ABA0280_SB_SUBSCRIPTION_AMT NUMBER(19,0),																																						
	ABA0280_SB_ACCEPTED_AMT NUMBER(19,0),																																						
	ABA0280_SB_ALLOTTED_AMT NUMBER(19,0)																																						
) ON COMMIT PRESERVE ROWS ;																																							
--------------------------------------------------------																																							
--  DDL for Table ABA0281_SB_TEMP_HOLDING																																							
--------------------------------------------------------																																							
																																							
CREATE GLOBAL TEMPORARY TABLE "MS9ABA"."ABA0281_SB_TEMP_HOLDING"																																							
(	ABA0281_SB_IC_PASSPORT VARCHAR2(14 BYTE),																																						
	ABA0281_SB_HOLDING_AMOUNT NUMBER(14,0)																																						
) ON COMMIT PRESERVE ROWS ;																																							
--------------------------------------------------------																																							
--  DDL for Table ABA0282_SB_CD_APPLICATION_TYPE																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."ABA0282_SB_CD_APPLICATION_TYPE"																																							
(	ABA0282_SB_CD_APPLICATION_TYPE VARCHAR2(5 BYTE),																																						
	ABA0282_SB_DESCRIPTION VARCHAR2(100 BYTE)																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table ABA0283_SB_COUPON_RESULT_FILE																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."ABA0283_SB_COUPON_RESULT_FILE"																																							
(	ABA0283_COUPON_ID NUMBER(19,0),																																						
	ABA0283_ISSUE_CODE CHAR(8 BYTE),																																						
	ABA0283_ISIN_CODE CHAR(12 BYTE),																																						
	ABA0283_MATURITY_DATE DATE,																																						
	ABA0283_CPN_RATE NUMBER,																																						
	ABA0283_NEXT_CPN_DATE DATE,																																						
	ABA0283_REMARKS_CPN_RATE VARCHAR2(30 BYTE),																																						
	ABA0283_REDEMPTION_RATE NUMBER,																																						
	ABA0283_REMARKS_RED_RATE VARCHAR2(30 BYTE),																																						
	ABA0283_CPN_PAYMENT_DATE DATE,																																						
	ABA0283_REDEMPTION_DATE DATE,																																						
	ABA0283_PROCESSING_DATE DATE																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table ABA0284_SB_PORTAL_SYNC																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."ABA0284_SB_PORTAL_SYNC"																																							
(	ABA0284_SB_TABLE_ID NUMBER(19,0),																																						
	ABA0284_SB_TABLE_NAME VARCHAR2(50 BYTE),																																						
	ABA0284_SB_LAST_SYNC_DT TIMESTAMP (6) DEFAULT CURRENT_TIMESTAMP																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table ABA0284_SB_PORTAL_SYNC_BK																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."ABA0284_SB_PORTAL_SYNC_BK"																																							
(	ABA0284_SB_TABLE_ID NUMBER(19,0),																																						
	ABA0284_SB_TABLE_NAME VARCHAR2(50 BYTE),																																						
	ABA0284_SB_LAST_SYNC_DT TIMESTAMP (6) DEFAULT CURRENT_TIMESTAMP																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table ABA0285_SB_USER_SESSION																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."ABA0285_SB_USER_SESSION"																																							
(	ABA0285_SB_USER_ID VARCHAR2(20 BYTE),																																						
	ABA0285_SB_SESSION_ID VARCHAR2(200 BYTE),																																						
	ABA0285_SB_LAST_LOGIN_DATE TIMESTAMP (6) DEFAULT CURRENT_TIMESTAMP																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table ABA233_SB_BATCH_JOB_BKUP																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."ABA233_SB_BATCH_JOB_BKUP"																																							
(	ABA0233_SB_JOB_ID NUMBER(19,0),																																						
	ABA0233_SB_JOB_TYPE VARCHAR2(100 BYTE),																																						
	ABA0233_SB_JOB_INSTANCE_ID NUMBER(19,0),																																						
	ABA0233_SB_JOB_STATUS VARCHAR2(1 BYTE),																																						
	ABA0233_SB_CREATED_DT DATE																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table AQA0001_LIMIT																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."AQA0001_LIMIT"																																							
(	AQA0001_WI_TRANS VARCHAR2(5 BYTE),																																						
	AQA0001_DEALER_LIMIT NUMBER(5,0),																																						
	AQA0001_OTHER_LIMIT NUMBER(5,0),																																						
	AQA0001_FIXED_COUPON CHAR(1 BYTE) DEFAULT 'Y',																																						
	AQA0001_UPDATE_TIME DATE DEFAULT SYSDATE																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 32768 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table AQA0002_TRANSACTION																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."AQA0002_TRANSACTION"																																							
(	AQA0002_RECORD_TYPE CHAR(2 BYTE),																																						
	AQA0002_SECURITY_CODE CHAR(8 BYTE),																																						
	AQA0002_ISSUE_NO CHAR(1 BYTE),																																						
	AQA0002_FORM_NO NUMBER(6,0),																																						
	AQA0002_USERID VARCHAR2(20 BYTE),																																						
	AQA0002_ENTERED_DATE DATE,																																						
	AQA0002_REC_STATUS CHAR(1 BYTE),																																						
	AQA0002_TENDER_DATE DATE,																																						
	AQA0002_DEALER_CODE NUMBER(4,0),																																						
	AQA0002_CUS_BANK NUMBER(4,0),																																						
	AQA0002_CUS_CD CHAR(1 BYTE),																																						
	AQA0002_CUS_SUB_CD CHAR(3 BYTE),																																						
	AQA0002_QTY_APP NUMBER(11,0),																																						
	AQA0002_BID_YL NUMBER(5,2),																																						
	AQA0002_COMP_CD CHAR(1 BYTE),																																						
	AQA0002_CUST_ACNO VARCHAR2(20 BYTE),																																						
	AQA0002_PAYMT_MOD CHAR(1 BYTE),																																						
	AQA0002_APP_NAME VARCHAR2(30 BYTE),																																						
	AQA0002_APP_TY CHAR(3 BYTE),																																						
	AQA0002_ALLOT_IND CHAR(1 BYTE),																																						
	AQA0002_QTY_ALLOT NUMBER(11,0),																																						
	AQA0002_AMT_ALLOT NUMBER(13,2),																																						
	AQA0002_PRICE NUMBER(7,4),																																						
	AQA0002_ACCR_INT NUMBER(11,2),																																						
	AQA0002_NATIONALITY CHAR(11 BYTE),																																						
	AQA0002_NRIC_PPNO CHAR(14 BYTE),																																						
	AQA0002_CPF_ACNO CHAR(16 BYTE),																																						
	AQA0002_EOVA_NRIC_PPNO CHAR(1 BYTE),																																						
	AQA0002_EOVA_CPF_ACNO CHAR(1 BYTE),																																						
	AQA0002_BANK_REF_NO VARCHAR2(12 BYTE),																																						
	AQA0002_REF_NO NUMBER(5,0),																																						
	AQA0002_CDP_ACNO VARCHAR2(16 BYTE),																																						
	AQA0002_SUB_MTD CHAR(1 BYTE),																																						
	AQA0002_FILE_TYPE VARCHAR2(3 BYTE)																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table AQA0002_TRANSACTION_15_11																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."AQA0002_TRANSACTION_15_11"																																							
(	AQA0002_RECORD_TYPE CHAR(2 BYTE),																																						
	AQA0002_SECURITY_CODE CHAR(8 BYTE),																																						
	AQA0002_ISSUE_NO CHAR(1 BYTE),																																						
	AQA0002_FORM_NO NUMBER(6,0),																																						
	AQA0002_USERID VARCHAR2(20 BYTE),																																						
	AQA0002_ENTERED_DATE DATE,																																						
	AQA0002_REC_STATUS CHAR(1 BYTE),																																						
	AQA0002_TENDER_DATE DATE,																																						
	AQA0002_DEALER_CODE NUMBER(4,0),																																						
	AQA0002_CUS_BANK NUMBER(4,0),																																						
	AQA0002_CUS_CD CHAR(1 BYTE),																																						
	AQA0002_CUS_SUB_CD CHAR(3 BYTE),																																						
	AQA0002_QTY_APP NUMBER(11,0),																																						
	AQA0002_BID_YL NUMBER(5,2),																																						
	AQA0002_COMP_CD CHAR(1 BYTE),																																						
	AQA0002_CUST_ACNO VARCHAR2(20 BYTE),																																						
	AQA0002_PAYMT_MOD CHAR(1 BYTE),																																						
	AQA0002_APP_NAME VARCHAR2(30 BYTE),																																						
	AQA0002_APP_TY CHAR(3 BYTE),																																						
	AQA0002_ALLOT_IND CHAR(1 BYTE),																																						
	AQA0002_QTY_ALLOT NUMBER(11,0),																																						
	AQA0002_AMT_ALLOT NUMBER(13,2),																																						
	AQA0002_PRICE NUMBER(7,4),																																						
	AQA0002_ACCR_INT NUMBER(11,2),																																						
	AQA0002_NATIONALITY CHAR(11 BYTE),																																						
	AQA0002_NRIC_PPNO CHAR(14 BYTE),																																						
	AQA0002_CPF_ACNO CHAR(16 BYTE),																																						
	AQA0002_EOVA_NRIC_PPNO CHAR(1 BYTE),																																						
	AQA0002_EOVA_CPF_ACNO CHAR(1 BYTE),																																						
	AQA0002_BANK_REF_NO VARCHAR2(12 BYTE),																																						
	AQA0002_REF_NO NUMBER(5,0),																																						
	AQA0002_CDP_ACNO VARCHAR2(16 BYTE),																																						
	AQA0002_SUB_MTD CHAR(1 BYTE),																																						
	AQA0002_FILE_TYPE VARCHAR2(3 BYTE)																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table AQA0002_TRANSACTION_20231209																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."AQA0002_TRANSACTION_20231209"																																							
(	AQA0002_RECORD_TYPE CHAR(2 BYTE),																																						
	AQA0002_SECURITY_CODE CHAR(8 BYTE),																																						
	AQA0002_ISSUE_NO CHAR(1 BYTE),																																						
	AQA0002_FORM_NO NUMBER(6,0),																																						
	AQA0002_USERID VARCHAR2(20 BYTE),																																						
	AQA0002_ENTERED_DATE DATE,																																						
	AQA0002_REC_STATUS CHAR(1 BYTE),																																						
	AQA0002_TENDER_DATE DATE,																																						
	AQA0002_DEALER_CODE NUMBER(4,0),																																						
	AQA0002_CUS_BANK NUMBER(4,0),																																						
	AQA0002_CUS_CD CHAR(1 BYTE),																																						
	AQA0002_CUS_SUB_CD CHAR(3 BYTE),																																						
	AQA0002_QTY_APP NUMBER(11,0),																																						
	AQA0002_BID_YL NUMBER(5,2),																																						
	AQA0002_COMP_CD CHAR(1 BYTE),																																						
	AQA0002_CUST_ACNO VARCHAR2(20 BYTE),																																						
	AQA0002_PAYMT_MOD CHAR(1 BYTE),																																						
	AQA0002_APP_NAME VARCHAR2(30 BYTE),																																						
	AQA0002_APP_TY CHAR(3 BYTE),																																						
	AQA0002_ALLOT_IND CHAR(1 BYTE),																																						
	AQA0002_QTY_ALLOT NUMBER(11,0),																																						
	AQA0002_AMT_ALLOT NUMBER(13,2),																																						
	AQA0002_PRICE NUMBER(7,4),																																						
	AQA0002_ACCR_INT NUMBER(11,2),																																						
	AQA0002_NATIONALITY CHAR(11 BYTE),																																						
	AQA0002_NRIC_PPNO CHAR(14 BYTE),																																						
	AQA0002_CPF_ACNO CHAR(16 BYTE),																																						
	AQA0002_EOVA_NRIC_PPNO CHAR(1 BYTE),																																						
	AQA0002_EOVA_CPF_ACNO CHAR(1 BYTE),																																						
	AQA0002_BANK_REF_NO VARCHAR2(12 BYTE),																																						
	AQA0002_REF_NO NUMBER(5,0),																																						
	AQA0002_CDP_ACNO VARCHAR2(16 BYTE),																																						
	AQA0002_SUB_MTD CHAR(1 BYTE),																																						
	AQA0002_FILE_TYPE VARCHAR2(3 BYTE) DEFAULT 'AP1'																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 4194304 NEXT 32768 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table AQA0002_TRANSACTION_BKP_10_11																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."AQA0002_TRANSACTION_BKP_10_11"																																							
(	AQA0002_RECORD_TYPE CHAR(2 BYTE),																																						
	AQA0002_SECURITY_CODE CHAR(8 BYTE),																																						
	AQA0002_ISSUE_NO CHAR(1 BYTE),																																						
	AQA0002_FORM_NO NUMBER(6,0),																																						
	AQA0002_USERID VARCHAR2(20 BYTE),																																						
	AQA0002_ENTERED_DATE DATE,																																						
	AQA0002_REC_STATUS CHAR(1 BYTE),																																						
	AQA0002_TENDER_DATE DATE,																																						
	AQA0002_DEALER_CODE NUMBER(4,0),																																						
	AQA0002_CUS_BANK NUMBER(4,0),																																						
	AQA0002_CUS_CD CHAR(1 BYTE),																																						
	AQA0002_CUS_SUB_CD CHAR(3 BYTE),																																						
	AQA0002_QTY_APP NUMBER(11,0),																																						
	AQA0002_BID_YL NUMBER(5,2),																																						
	AQA0002_COMP_CD CHAR(1 BYTE),																																						
	AQA0002_CUST_ACNO VARCHAR2(20 BYTE),																																						
	AQA0002_PAYMT_MOD CHAR(1 BYTE),																																						
	AQA0002_APP_NAME VARCHAR2(30 BYTE),																																						
	AQA0002_APP_TY CHAR(3 BYTE),																																						
	AQA0002_ALLOT_IND CHAR(1 BYTE),																																						
	AQA0002_QTY_ALLOT NUMBER(11,0),																																						
	AQA0002_AMT_ALLOT NUMBER(13,2),																																						
	AQA0002_PRICE NUMBER(7,4),																																						
	AQA0002_ACCR_INT NUMBER(11,2),																																						
	AQA0002_NATIONALITY CHAR(11 BYTE),																																						
	AQA0002_NRIC_PPNO CHAR(14 BYTE),																																						
	AQA0002_CPF_ACNO CHAR(16 BYTE),																																						
	AQA0002_EOVA_NRIC_PPNO CHAR(1 BYTE),																																						
	AQA0002_EOVA_CPF_ACNO CHAR(1 BYTE),																																						
	AQA0002_BANK_REF_NO VARCHAR2(12 BYTE),																																						
	AQA0002_REF_NO NUMBER(5,0),																																						
	AQA0002_CDP_ACNO VARCHAR2(16 BYTE),																																						
	AQA0002_SUB_MTD CHAR(1 BYTE),																																						
	AQA0002_FILE_TYPE VARCHAR2(3 BYTE)																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table AQA0003_USER																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."AQA0003_USER"																																							
(	AQA0003_USER_ID VARCHAR2(20 BYTE),																																						
	AQA0003_LEVEL NUMBER(3,0) DEFAULT 0,																																						
	AQA0003_USER_LAST_LOGIN DATE DEFAULT SYSDATE,																																						
	AQA0003_USER_ACCESS_CHANGE DATE DEFAULT SYSDATE																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 16384 NEXT 32768 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table AQA0004_LEVEL_ACTION																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."AQA0004_LEVEL_ACTION"																																							
(	AQA0004_LEVEL NUMBER(3,0),																																						
	AQA0004_MODULE VARCHAR2(100 BYTE),																																						
	AQA0004_ACTION VARCHAR2(50 BYTE)																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 2097152 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table AQA0005_REPORT_COUNTER																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."AQA0005_REPORT_COUNTER"																																							
(	AQA0005_DATE DATE,																																						
	AQA0005_COUNT NUMBER(3,0),																																						
	AQA0005_UPDATED_TIME DATE DEFAULT SYSDATE																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 32768 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table AQA0006_EAPPS_TRANSACTION																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."AQA0006_EAPPS_TRANSACTION"																																							
(	AQA0006_SECURITY_CODE CHAR(8 BYTE),																																						
	AQA0006_ISSUE_NO CHAR(1 BYTE) DEFAULT 0,																																						
	AQA0006_REFERENCE_NO NUMBER(5,0),																																						
	AQA0006_RECEIVED_DATE DATE DEFAULT SYSDATE,																																						
	AQA0006_RECEIVED_TIME DATE DEFAULT SYSDATE,																																						
	AQA0006_USER_ID VARCHAR2(8 BYTE),																																						
	AQA0006_TRANS_TYPE CHAR(3 BYTE),																																						
	AQA0006_NOMINAL_AMT1 NUMBER(11,0),																																						
	AQA0006_COMPETITIVE_CHECK1 CHAR(1 BYTE),																																						
	AQA0006_YIELD1 NUMBER(5,2),																																						
	AQA0006_NOMINAL_AMT2 NUMBER(11,0),																																						
	AQA0006_COMPETITIVE_CHECK2 CHAR(1 BYTE),																																						
	AQA0006_YIELD2 NUMBER(5,2),																																						
	AQA0006_NOMINAL_AMT3 NUMBER(11,0),																																						
	AQA0006_COMPETITIVE_CHECK3 CHAR(1 BYTE),																																						
	AQA0006_YIELD3 NUMBER(5,2),																																						
	AQA0006_NOMINAL_AMT4 NUMBER(11,0),																																						
	AQA0006_COMPETITIVE_CHECK4 CHAR(1 BYTE),																																						
	AQA0006_YIELD4 NUMBER(5,2),																																						
	AQA0006_NOMINAL_AMT5 NUMBER(11,0),																																						
	AQA0006_COMPETITIVE_CHECK5 CHAR(1 BYTE),																																						
	AQA0006_YIELD5 NUMBER(5,2),																																						
	AQA0006_NAME_OF_APPLICANT VARCHAR2(30 BYTE),																																						
	AQA0006_NATIONALITY CHAR(1 BYTE),																																						
	AQA0006_NRIC_NO VARCHAR2(14 BYTE),																																						
	AQA0006_CPF_ACC_NO CHAR(16 BYTE),																																						
	AQA0006_BANK_ACC_CODE NUMBER(4,0),																																						
	AQA0006_SETTLEMENT_BANK_CODE NUMBER(4,0),																																						
	AQA0006_BANK_OR_CUSTODIAN CHAR(1 BYTE),																																						
	AQA0006_TYPE_OF_APPLICANT VARCHAR2(3 BYTE),																																						
	AQA0006_REC_STATUS CHAR(1 BYTE),																																						
	AQA0006_CHECKSUM NUMBER(15,0),																																						
	AQA0006_UPDATED_TIME DATE DEFAULT SYSDATE,																																						
	AQA0006_BANK_REF_NO VARCHAR2(12 BYTE),																																						
	AQA0006_CDP_ACNO VARCHAR2(16 BYTE),																																						
	AQA0006_SUB_MTD CHAR(1 BYTE),																																						
	AQA0006_FILE_TYPE VARCHAR2(3 BYTE) DEFAULT 'AP1'																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 4194304 NEXT 32768 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table AQA0007_COPY_SEC_MASTER_IND																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."AQA0007_COPY_SEC_MASTER_IND"																																							
(	AQA0007_DATA_DATE DATE,																																						
	AQA0007_COPIED_INDICATOR CHAR(1 BYTE),																																						
	AQA0007_UPDATED_TIME DATE DEFAULT SYSDATE																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 32768 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table AQA0008_SEC_AUCTION_PARA																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."AQA0008_SEC_AUCTION_PARA"																																							
(	AQA0008_SECURITY_CODE CHAR(8 BYTE),																																						
	AQA0008_ISSUE_NO CHAR(1 BYTE),																																						
	AQA0008_MIDPOINT_YIELD NUMBER(6,3),																																						
	AQA0008_CORRIDOR NUMBER(5,3),																																						
	AQA0008_MAS_MAX_AMT NUMBER(13,0),																																						
	AQA0008_UPDATED_TIME DATE DEFAULT SYSDATE,																																						
	AQA0008_STATUS CHAR(1 BYTE),																																						
	AQA0008_RECORD_STATUS CHAR(1 BYTE),																																						
	AQA0008_REF_POINT NUMBER(6,3),																																						
	AQA0008_ADDED_BY VARCHAR2(20 BYTE)																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 32768 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table AQA0009_SEC_AUCTION_PARA_CTG_STG																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."AQA0009_SEC_AUCTION_PARA_CTG_STG"																																							
(	AQA0009_SECURITY_CODE CHAR(8 BYTE),																																						
	AQA0009_ISSUE_NO CHAR(1 BYTE),																																						
	AQA0009_REF_POINT NUMBER(6,3),																																						
	AQA0009_UPPER_BOUND NUMBER(6,3),																																						
	AQA0009_LOWER_BOUND NUMBER(6,3),																																						
	AQA0009_MAS_MAX_AMT NUMBER(13,0)																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table AQA0010_ACTION_REF																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."AQA0010_ACTION_REF"																																							
(	AQA0010_MODULE VARCHAR2(100 BYTE),																																						
	AQA0010_ACTION VARCHAR2(50 BYTE),																																						
	AQA0010_DESC VARCHAR2(300 BYTE)																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 2097152 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table AQA0011_USER_SESSION																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."AQA0011_USER_SESSION"																																							
(	AQA0011_USER_ID VARCHAR2(20 BYTE),																																						
	AQA0011_SESSION_ID VARCHAR2(200 BYTE),																																						
	AQA0011_LAST_LOGIN_DATE TIMESTAMP (6) DEFAULT CURRENT_TIMESTAMP																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table AQA0012_SYNDICATION_INS_RET_DT																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."AQA0012_SYNDICATION_INS_RET_DT"																																							
(	AQA0012_SECURITY_CODE CHAR(8 BYTE),																																						
	AQA0012_ISSUE_NO VARCHAR2(1 BYTE),																																						
	AQA0012_FORM_NO NUMBER(6,0),																																						
	AQA0012_ISIN_CODE CHAR(12 BYTE),																																						
	AQA0012_CUST_BANK_CODE NUMBER(4,0),																																						
	AQA0012_CUSTODY_CD CHAR(3 BYTE),																																						
	AQA0012_APPLIED_AMT NUMBER(11,0),																																						
	AQA0012_ALLOTED_AMT NUMBER(11,0),																																						
	AQA0012_SETTLEMENT_AMT NUMBER(15,2),																																						
	AQA0012_FILE_TYPE VARCHAR2(3 BYTE),																																						
	AQA0012_SYS_COMPUTED_ACCR_INT NUMBER(11,2),																																						
	AQA0012_SYS_COMPUTED_SETT_AMT NUMBER(15,2),																																						
	AQA0012_SETTLEMENT_AMT_MATCHES VARCHAR2(3 BYTE),																																						
	AQA0012_USERID VARCHAR2(20 BYTE),																																						
	AQA0012_UPLOADED_DATE DATE DEFAULT SYSDATE																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 57344 NEXT 32768 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table AQA0013_SYNDICATION_COUPON_DT																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."AQA0013_SYNDICATION_COUPON_DT"																																							
(	AQA0013_SECURITY_CODE CHAR(8 BYTE),																																						
	AQA0013_ISSUE_NO VARCHAR2(1 BYTE),																																						
	AQA0013_ISIN_CODE CHAR(12 BYTE),																																						
	AQA0013_COUPON_RATE NUMBER(7,4),																																						
	AQA0013_COY_PRICE NUMBER(7,4),																																						
	AQA0013_CUTOFF_YIELD NUMBER(5,2),																																						
	AQA0013_BID_TO_COVER NUMBER(5,2),																																						
	AQA0013_SYS_COMPUTED_ACCR_INT NUMBER(7,4),																																						
	AQA0013_SYS_COMPUTED_COY_PRICE NUMBER(7,4),																																						
	AQA0013_COY_PRICE_MATCHES VARCHAR2(3 BYTE),																																						
	AQA0013_TOTAL_ALLOTED_AMT NUMBER(13,0),																																						
	AQA0013_ISSUE_SIZE_MATCHES VARCHAR2(3 BYTE),																																						
	AQA0013_USERID VARCHAR2(20 BYTE),																																						
	AQA0013_UPLOADED_DATE DATE DEFAULT SYSDATE																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 57344 NEXT 32768 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table AQA0014_SYNDICATION_RPT_COUNT																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."AQA0014_SYNDICATION_RPT_COUNT"																																							
(	AQA0014_DATE DATE,																																						
	AQA0014_COUNT NUMBER(3,0),																																						
	AQA0014_UPDATED_TIME DATE DEFAULT SYSDATE																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 16384 NEXT 32768 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table AQA0015_COPY_SYND_SEC_MAST_IND																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."AQA0015_COPY_SYND_SEC_MAST_IND"																																							
(	AQA0015_DATA_DATE DATE,																																						
	AQA0015_COPIED_INDICATOR CHAR(1 BYTE),																																						
	AQA0015_UPDATED_TIME DATE DEFAULT SYSDATE																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 16384 NEXT 32768 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table AQA0016_SYNDICATED_SEC_MAST_DT																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."AQA0016_SYNDICATED_SEC_MAST_DT"																																							
(	AQA0016_SECURITY_CODE CHAR(8 BYTE),																																						
	AQA0016_ISSUE_NO VARCHAR2(1 BYTE),																																						
	AQA0016_ISIN_CODE CHAR(12 BYTE),																																						
	AQA0016_QTY_APP_NONCOMP NUMBER(13,0),																																						
	AQA0016_NC_QTY_ALLOT NUMBER(13,0),																																						
	AQA0016_NC_PERCENT NUMBER(5,2),																																						
	AQA0016_QTY_APPLIED NUMBER(13,0),																																						
	AQA0016_QTY_APP_COMP NUMBER(13,0),																																						
	AQA0016_MAS_ALLOTTED NUMBER(13,0),																																						
	AQA0016_PERCENT_SUB NUMBER(5,2),																																						
	AQA0016_PERCENT_COY NUMBER(5,2),																																						
	AQA0016_INTEREST_RATE NUMBER(7,4),																																						
	AQA0016_CUTOFF_YIELD NUMBER(5,2),																																						
	AQA0016_CLOSING_PRICE NUMBER(7,4),																																						
	AQA0016_COY_PRICE NUMBER(7,4),																																						
	AQA0016_AVE_YIELD NUMBER(5,2),																																						
	AQA0016_AVE_PRICE NUMBER(7,4),																																						
	AQA0016_MEDIAN_YIELD NUMBER(5,2),																																						
	AQA0016_MEDIAN_PRICE NUMBER(7,4),																																						
	AQA0016_ACCRUED_INT NUMBER(7,4),																																						
	AQA0016_UPDATED_TIME DATE DEFAULT SYSDATE																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 24576 NEXT 32768 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table AQA0017_AUCTION_IND																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."AQA0017_AUCTION_IND"																																							
(	AQA0017_AUCTION_DATE VARCHAR2(10 BYTE),																																						
	AQA0017_AUCTION_RUN VARCHAR2(1 BYTE),																																						
	AQA0017_DECRYPT_BIDS VARCHAR2(1 BYTE) DEFAULT NULL,																																						
	AQA0017_AUCTION_ENGINE VARCHAR2(1 BYTE) DEFAULT NULL																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 57344 NEXT 32768 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table AQA0017_AUCTION_IND_20230817																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."AQA0017_AUCTION_IND_20230817"																																							
(	AQA0017_AUCTION_DATE VARCHAR2(10 BYTE),																																						
	AQA0017_AUCTION_RUN VARCHAR2(1 BYTE)																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table AQA0018_RETAIL_BID_PROC_IND																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."AQA0018_RETAIL_BID_PROC_IND"																																							
(	AQA0018_RETAIL_BID_PROC_DATE VARCHAR2(10 BYTE),																																						
	AQA0018_RETAIL_BID_IND VARCHAR2(1 BYTE)																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table AQA0018_RETAIL_BID_PROC_TMP																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."AQA0018_RETAIL_BID_PROC_TMP"																																							
(	AQA0018_RETAIL_BID_PROC_DATE VARCHAR2(10 BYTE),																																						
	AQA0018_RETAIL_BID_IND VARCHAR2(1 BYTE)																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 65536 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table AQA0019_AUCTION_REPORT_IND																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."AQA0019_AUCTION_REPORT_IND"																																							
(	AQA0019_REPORT_NAME VARCHAR2(50 BYTE),																																						
	AQA0019_REPORT_RUN_DATE VARCHAR2(10 BYTE),																																						
	AQA0019_REPORT_IND VARCHAR2(1 BYTE)																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table AQA0020_AUCTION_RESULTS_REPORT																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."AQA0020_AUCTION_RESULTS_REPORT"																																							
(	AQA0020_RECORD_TYPE CHAR(2 BYTE),																																						
	AQA0020_SECURITY_CODE CHAR(8 BYTE),																																						
	AQA0020_ISSUE_NO CHAR(1 BYTE),																																						
	AQA0020_FORM_NO NUMBER(6,0),																																						
	AQA0020_REC_STATUS CHAR(1 BYTE),																																						
	AQA0020_TENDER_DATE DATE,																																						
	AQA0020_DEALER_CODE NUMBER(4,0),																																						
	AQA0020_CUS_BANK NUMBER(4,0),																																						
	AQA0020_CUS_CD CHAR(1 BYTE),																																						
	AQA0020_CUS_SUB_CD CHAR(3 BYTE),																																						
	AQA0020_QTY_APP NUMBER(11,0),																																						
	AQA0020_BID_YL NUMBER(5,2),																																						
	AQA0020_COMP_CD CHAR(1 BYTE),																																						
	AQA0020_CUST_ACNO VARCHAR2(20 BYTE),																																						
	AQA0020_APP_NAME VARCHAR2(40 BYTE),																																						
	AQA0020_APP_TY CHAR(3 BYTE),																																						
	AQA0020_QTY_ALLOT NUMBER(11,0),																																						
	AQA0020_AMT_ALLOT NUMBER(13,2),																																						
	AQA0020_PRICE NUMBER(7,4),																																						
	AQA0020_NATIONALITY CHAR(11 BYTE),																																						
	AQA0020_NRIC_PPNO CHAR(14 BYTE),																																						
	AQA0020_CPF_ACNO CHAR(16 BYTE),																																						
	AQA0020_BANK_REF_NO VARCHAR2(12 BYTE),																																						
	AQA0020_CDP_ACNO VARCHAR2(16 BYTE),																																						
	AQA0020_SUB_MTD CHAR(1 BYTE),																																						
	AQA0020_FILE_TYPE VARCHAR2(3 BYTE),																																						
	AQA0020_ALLOT_IND CHAR(1 BYTE),																																						
	AQA0020_EOVA_NRIC_PPNO CHAR(1 BYTE),																																						
	AQA0020_ACCR_INT NUMBER(11,2),																																						
	AQA0020_EOVA_CPF_ACNO CHAR(1 BYTE),																																						
	AQA0020_USERID VARCHAR2(20 BYTE),																																						
	AQA0020_PAYMT_MOD CHAR(1 BYTE),																																						
	AQA0020_QTY_ALLOT_LIMIT NUMBER(11,0),																																						
	AQA0020_S_NAME VARCHAR2(30 BYTE),																																						
	AQA0020_QTY_REJECTED NUMBER(11,0),																																						
	AQA0020_REF_NO NUMBER(5,0),																																						
	AQA0020_WS_IND NUMBER(1,0)																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table AQA0020_AUCTION_RESULTS_REPORT_20231115																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."AQA0020_AUCTION_RESULTS_REPORT_20231115"																																							
(	AQA0020_RECORD_TYPE CHAR(2 BYTE),																																						
	AQA0020_SECURITY_CODE CHAR(8 BYTE),																																						
	AQA0020_ISSUE_NO CHAR(1 BYTE),																																						
	AQA0020_FORM_NO NUMBER(6,0),																																						
	AQA0020_REC_STATUS CHAR(1 BYTE),																																						
	AQA0020_TENDER_DATE DATE,																																						
	AQA0020_DEALER_CODE NUMBER(4,0),																																						
	AQA0020_CUS_BANK NUMBER(4,0),																																						
	AQA0020_CUS_CD CHAR(1 BYTE),																																						
	AQA0020_CUS_SUB_CD CHAR(3 BYTE),																																						
	AQA0020_QTY_APP NUMBER(11,0),																																						
	AQA0020_BID_YL NUMBER(5,2),																																						
	AQA0020_COMP_CD CHAR(1 BYTE),																																						
	AQA0020_CUST_ACNO VARCHAR2(20 BYTE),																																						
	AQA0020_APP_NAME VARCHAR2(40 BYTE),																																						
	AQA0020_APP_TY CHAR(3 BYTE),																																						
	AQA0020_QTY_ALLOT NUMBER(11,0),																																						
	AQA0020_AMT_ALLOT NUMBER(13,2),																																						
	AQA0020_PRICE NUMBER(7,4),																																						
	AQA0020_NATIONALITY CHAR(11 BYTE),																																						
	AQA0020_NRIC_PPNO CHAR(14 BYTE),																																						
	AQA0020_CPF_ACNO CHAR(16 BYTE),																																						
	AQA0020_BANK_REF_NO VARCHAR2(12 BYTE),																																						
	AQA0020_CDP_ACNO VARCHAR2(16 BYTE),																																						
	AQA0020_SUB_MTD CHAR(1 BYTE),																																						
	AQA0020_FILE_TYPE VARCHAR2(3 BYTE),																																						
	AQA0020_ALLOT_IND CHAR(1 BYTE),																																						
	AQA0020_EOVA_NRIC_PPNO CHAR(1 BYTE),																																						
	AQA0020_ACCR_INT NUMBER(11,2),																																						
	AQA0020_EOVA_CPF_ACNO CHAR(1 BYTE),																																						
	AQA0020_USERID VARCHAR2(20 BYTE),																																						
	AQA0020_PAYMT_MOD CHAR(1 BYTE),																																						
	AQA0020_QTY_ALLOT_LIMIT NUMBER(11,0),																																						
	AQA0020_S_NAME VARCHAR2(30 BYTE),																																						
	AQA0020_QTY_REJECTED NUMBER(11,0),																																						
	AQA0020_REF_NO NUMBER(5,0),																																						
	AQA0020_WS_IND NUMBER(1,0)																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table AQA0021_AUCTION_RESULTS_REPORT_CTG_STG																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."AQA0021_AUCTION_RESULTS_REPORT_CTG_STG"																																							
(	AQA0021_SECURITY_CODE CHAR(8 BYTE),																																						
	AQA0021_ISSUE_NO CHAR(1 BYTE),																																						
	AQA0021_FORM_NO NUMBER(6,0),																																						
	AQA0021_QTY_APP NUMBER(11,0),																																						
	AQA0021_APP_NAME VARCHAR2(40 BYTE),																																						
	AQA0021_QTY_ALLOT NUMBER(11,0),																																						
	AQA0021_BANK_REF_NO VARCHAR2(12 BYTE),																																						
	AQA0021_ALLOT_IND CHAR(1 BYTE),																																						
	AQA0021_ACCR_INT NUMBER(11,2)																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table AQA0101_REPO_TRANS																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."AQA0101_REPO_TRANS"																																							
(	AQA0101_BANK_CODE CHAR(4 BYTE),																																						
	AQA0101_SEQ_NO CHAR(5 BYTE),																																						
	AQA0101_TRANS_REF_NO CHAR(16 BYTE),																																						
	AQA0101_REQ_SEC_CODE CHAR(8 BYTE),																																						
	AQA0101_REQ_NOMINAL_AMT NUMBER(13,0),																																						
	AQA0101_NOMINAL_AMT_ALLOT NUMBER(13,0),																																						
	AQA0101_REQ_DIRTY_PRICE NUMBER(7,4),																																						
	AQA0101_REQ_CLEAN_PRICE NUMBER(7,4),																																						
	AQA0101_EXG_SEC_CODE CHAR(8 BYTE),																																						
	AQA0101_EXG_NOMINAL_AMT NUMBER(13,0),																																						
	AQA0101_EXG_DIRTY_PRICE NUMBER(7,4),																																						
	AQA0101_EXG_CLEAN_PRICE NUMBER(7,4),																																						
	AQA0101_REPO_RATE NUMBER(7,4),																																						
	AQA0101_REPO_FEE NUMBER(13,2),																																						
	AQA0101_HAIRCUT NUMBER(7,4),																																						
	AQA0101_STATUS_FLAG CHAR(1 BYTE) DEFAULT 'N',																																						
	AQA0101_LIMIT_IND CHAR(1 BYTE),																																						
	AQA0101_RECEIVED_DT DATE,																																						
	AQA0101_REQ_HC_CLEAN_PRICE NUMBER(7,4),																																						
	AQA0101_REQ_HC_DIRTY_PRICE NUMBER(7,4),																																						
	AQA0101_EXG_HC_CLEAN_PRICE NUMBER(7,4),																																						
	AQA0101_EXG_HC_DIRTY_PRICE NUMBER(7,4),																																						
	AQA0101_UPDATED_DT TIMESTAMP (3)																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 32768 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table AQA0102_USER																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."AQA0102_USER"																																							
(	AQA0102_USER_ID VARCHAR2(20 CHAR),																																						
	AQA0102_LEVEL NUMBER(1,0),																																						
	AQA0102_USER_LAST_LOGIN DATE,																																						
	AQA0102_USER_LVL_CHANGE DATE																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 32768 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table AQA0103_PRIVATE_KEY																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."AQA0103_PRIVATE_KEY"																																							
(	AQA0103_PRIVATE_KEY VARCHAR2(4000 BYTE),																																						
	AQA0103_UPDATED_DT DATE,																																						
	AQA0103_CURRENT_KEY VARCHAR2(1 BYTE)																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 32768 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table AQA0104_ERF_SYSTEM_PARM																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."AQA0104_ERF_SYSTEM_PARM"																																							
(	AQA0104_DEFAULT_CUT_OFF_TIME DATE,																																						
	AQA0104_UPDATED_DT DATE,																																						
	AQA0104_MIN_LIMIT_PER_ISSUE NUMBER(20,0) DEFAULT 1000000,																																						
	AQA0104_MAX_LIMIT_PER_ISSUE NUMBER(20,0) DEFAULT 50000000,																																						
	AQA0104_MAX_LIMIT_ALL_ISSUE NUMBER(20,0) DEFAULT 500000000,																																						
	AQA0104_MAX_LIMIT_ALL_INFRA NUMBER(20,0) DEFAULT 500000000																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS NOLOGGING																																							
STORAGE(INITIAL 1048576 NEXT 32768 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table AQA0104_SYSTEM_PARM																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."AQA0104_SYSTEM_PARM"																																							
(	AQA0104_INPUT_SETTLE_DATE CHAR(1 BYTE),																																						
	AQA0104_AUTO_MANUAL_IND CHAR(1 BYTE),																																						
	AQA0104_DEFAULT_CUT_OFF_TIME DATE,																																						
	AQA0104_UPDATED_DT DATE																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS NOLOGGING																																							
STORAGE(INITIAL 1048576 NEXT 32768 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table AQA0105_CYCLE																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."AQA0105_CYCLE"																																							
(	AQA0105_CYCLE_DATE DATE,																																						
	AQA0105_PRICE_DATE DATE,																																						
	AQA0105_UPDATED_DT DATE																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 32768 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table AQA0105_ERF_CYCLE																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."AQA0105_ERF_CYCLE"																																							
(	AQA0105_CYCLE_DATE DATE,																																						
	AQA0105_PRICE_DATE DATE,																																						
	AQA0105_UPDATED_DT DATE																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 32768 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table AQA0107_AUDIT_LOG																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."AQA0107_AUDIT_LOG"																																							
(	AQA0107_LOG_CD NUMBER(2,0),																																						
	AQA0107_USER_ID VARCHAR2(20 BYTE),																																						
	AQA0107_REMARKS VARCHAR2(100 BYTE),																																						
	AQA0107_UPDATED_DT DATE																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 32768 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table AQA0107_ERF_AUDIT_LOG																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."AQA0107_ERF_AUDIT_LOG"																																							
(	AQA0107_LOG_CD NUMBER(2,0),																																						
	AQA0107_USER_ID VARCHAR2(20 CHAR),																																						
	AQA0107_REMARKS VARCHAR2(100 BYTE),																																						
	AQA0107_UPDATED_DT DATE																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 32768 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table AQA0108_ERF_LOG_DETAIL																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."AQA0108_ERF_LOG_DETAIL"																																							
(	AQA0108_LOG_CD NUMBER(2,0),																																						
	AQA0108_LOG_DESC VARCHAR2(50 BYTE)																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 32768 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table AQA0108_LOG_DETAIL																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."AQA0108_LOG_DETAIL"																																							
(	AQA0108_LOG_CD NUMBER(2,0),																																						
	AQA0108_LOG_DESC VARCHAR2(50 BYTE)																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 32768 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table AQA0109_HAIRCUT_SETTINGS																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."AQA0109_HAIRCUT_SETTINGS"																																							
(	AQA0109_HAIRCUT_LIMIT NUMBER(13,0),																																						
	AQA0109_HAIRCUT_PERCENT NUMBER(7,4),																																						
	AQA0109_UPDATED_DT DATE																																						
) SEGMENT CREATION DEFERRED																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table AQA0111_CANCEL_TRADE																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."AQA0111_CANCEL_TRADE"																																							
(	AQA0111_SECURITY_CODE CHAR(8 BYTE),																																						
	AQA0111_BANK_CODE CHAR(4 BYTE),																																						
	AQA0111_SEQ_NO CHAR(5 BYTE),																																						
	AQA0111_TRANS_REF_NO CHAR(16 BYTE),																																						
	AQA0111_EXG_SEC_CODE CHAR(8 BYTE),																																						
	AQA0111_ALLOTTED_AMT NUMBER(13,0),																																						
	AQA0111_RECEIVED_DT DATE																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 32768 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table AQA0112_DUR_RATE																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."AQA0112_DUR_RATE"																																							
(	AQA0112_REF_NO CHAR(10 BYTE),																																						
	AQA0112_LOW_DURATION NUMBER(7,4),																																						
	AQA0112_HIGH_DURATION NUMBER(7,4),																																						
	AQA0112_REPO_RATE NUMBER(7,4),																																						
	AQA0112_DATE_CHANGE DATE																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 3145728 NEXT 32768 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table AQA0113_USER_SESSION																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."AQA0113_USER_SESSION"																																							
(	AQA0113_USER_ID VARCHAR2(20 BYTE),																																						
	AQA0113_SESSION_ID VARCHAR2(200 BYTE),																																						
	AQA0113_LAST_LOGIN_DATE TIMESTAMP (6) DEFAULT CURRENT_TIMESTAMP																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table BATCH_JOB_EXECUTION																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."BATCH_JOB_EXECUTION"																																							
(	JOB_EXECUTION_ID NUMBER(19,0),																																						
	JOB_INSTANCE_ID NUMBER(19,0),																																						
	VERSION NUMBER(19,0),																																						
	CREATE_TIME TIMESTAMP (6),																																						
	START_TIME TIMESTAMP (6) DEFAULT NULL,																																						
	END_TIME TIMESTAMP (6) DEFAULT NULL,																																						
	STATUS VARCHAR2(10 BYTE),																																						
	EXIT_CODE VARCHAR2(2500 BYTE),																																						
	EXIT_MESSAGE VARCHAR2(2500 BYTE),																																						
	LAST_UPDATED TIMESTAMP (6),																																						
	JOB_CONFIGURATION_LOCATION VARCHAR2(2500 BYTE)																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table BATCH_JOB_EXECUTION_CONTEXT																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."BATCH_JOB_EXECUTION_CONTEXT"																																							
(	JOB_EXECUTION_ID NUMBER(19,0),																																						
	SHORT_CONTEXT VARCHAR2(2500 BYTE),																																						
	SERIALIZED_CONTEXT CLOB																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP"																																							
LOB ("SERIALIZED_CONTEXT") STORE AS BASICFILE (																																							
TABLESPACE "ABAAPP" ENABLE STORAGE IN ROW CHUNK 8192 RETENTION																																							
NOCACHE LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)) ;																																							
--------------------------------------------------------																																							
--  DDL for Table BATCH_JOB_EXECUTION_PARAMS																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."BATCH_JOB_EXECUTION_PARAMS"																																							
(	JOB_EXECUTION_ID NUMBER(19,0),																																						
	TYPE_CD VARCHAR2(6 BYTE),																																						
	KEY_NAME VARCHAR2(100 BYTE),																																						
	STRING_VAL VARCHAR2(250 BYTE),																																						
	DATE_VAL TIMESTAMP (6) DEFAULT NULL,																																						
	LONG_VAL NUMBER(19,0),																																						
	DOUBLE_VAL NUMBER,																																						
	IDENTIFYING CHAR(1 BYTE)																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table BATCH_JOB_INSTANCE																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."BATCH_JOB_INSTANCE"																																							
(	JOB_INSTANCE_ID NUMBER(19,0),																																						
	VERSION NUMBER(19,0),																																						
	JOB_NAME VARCHAR2(100 BYTE),																																						
	JOB_KEY VARCHAR2(32 BYTE)																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table BATCH_STEP_EXECUTION																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."BATCH_STEP_EXECUTION"																																							
(	STEP_EXECUTION_ID NUMBER(19,0),																																						
	VERSION NUMBER(19,0),																																						
	STEP_NAME VARCHAR2(100 BYTE),																																						
	JOB_EXECUTION_ID NUMBER(19,0),																																						
	START_TIME TIMESTAMP (6),																																						
	END_TIME TIMESTAMP (6) DEFAULT NULL,																																						
	STATUS VARCHAR2(10 BYTE),																																						
	COMMIT_COUNT NUMBER(19,0),																																						
	READ_COUNT NUMBER(19,0),																																						
	FILTER_COUNT NUMBER(19,0),																																						
	WRITE_COUNT NUMBER(19,0),																																						
	READ_SKIP_COUNT NUMBER(19,0),																																						
	WRITE_SKIP_COUNT NUMBER(19,0),																																						
	PROCESS_SKIP_COUNT NUMBER(19,0),																																						
	ROLLBACK_COUNT NUMBER(19,0),																																						
	EXIT_CODE VARCHAR2(2500 BYTE),																																						
	EXIT_MESSAGE VARCHAR2(2500 BYTE),																																						
	LAST_UPDATED TIMESTAMP (6)																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table BATCH_STEP_EXECUTION_CONTEXT																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."BATCH_STEP_EXECUTION_CONTEXT"																																							
(	STEP_EXECUTION_ID NUMBER(19,0),																																						
	SHORT_CONTEXT VARCHAR2(2500 BYTE),																																						
	SERIALIZED_CONTEXT CLOB																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP"																																							
LOB ("SERIALIZED_CONTEXT") STORE AS BASICFILE (																																							
TABLESPACE "ABAAPP" ENABLE STORAGE IN ROW CHUNK 8192 RETENTION																																							
NOCACHE LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)) ;																																							
--------------------------------------------------------																																							
--  DDL for Table MLOG$_ABA0223_SB_APPLICANT																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."MLOG$_ABA0223_SB_APPLICANT"																																							
(	M_ROW$$ VARCHAR2(255 BYTE),																																						
	SNAPTIME$$ DATE,																																						
	DMLTYPE$$ VARCHAR2(1 BYTE),																																						
	OLD_NEW$$ VARCHAR2(1 BYTE),																																						
	CHANGE_VECTOR$$ RAW(255),																																						
	XID$$ NUMBER																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 30 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
																																							
COMMENT ON TABLE "MS9ABA"."MLOG$_ABA0223_SB_APPLICANT"  IS 'snapshot log for master table MS9ABA.ABA0223_SB_APPLICANT';																																							
--------------------------------------------------------																																							
--  DDL for Table MLOG$_ABA0225_SB_SUBSCRIPT																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."MLOG$_ABA0225_SB_SUBSCRIPT"																																							
(	M_ROW$$ VARCHAR2(255 BYTE),																																						
	SNAPTIME$$ DATE,																																						
	DMLTYPE$$ VARCHAR2(1 BYTE),																																						
	OLD_NEW$$ VARCHAR2(1 BYTE),																																						
	CHANGE_VECTOR$$ RAW(255),																																						
	XID$$ NUMBER																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 30 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
																																							
COMMENT ON TABLE "MS9ABA"."MLOG$_ABA0225_SB_SUBSCRIPT"  IS 'snapshot log for master table MS9ABA.ABA0225_SB_SUBSCRIPT_DT';																																							
--------------------------------------------------------																																							
--  DDL for Table TEMP1																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."TEMP1"																																							
(	COLUMN1 VARCHAR2(20 BYTE),																																						
	COLUMN2 VARCHAR2(20 BYTE)																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table TEMP_AFTERDBEXPORT																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."TEMP_AFTERDBEXPORT"																																							
(	COLUMN1 VARCHAR2(20 BYTE)																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table TESTSYNC																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."TESTSYNC"																																							
(	ABA0284_SB_TABLE_ID NUMBER(19,0),																																						
	ABA0284_SB_TABLE_NAME VARCHAR2(50 BYTE),																																						
	ABA0284_SB_LAST_SYNC_DT TIMESTAMP (6) DEFAULT CURRENT_TIMESTAMP,																																						
	TEST VARCHAR2(32 BYTE)																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table TEST_DB_DUMP																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."TEST_DB_DUMP"																																							
(	COLUMN1 VARCHAR2(20 BYTE)																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table TMP_CALL_CENTRE																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."TMP_CALL_CENTRE"																																							
(	TMP_CALL_CTR_DTL VARCHAR2(2000 BYTE),																																						
	TMP_CALL_CTR_STA VARCHAR2(100 BYTE),																																						
	TMP_CALL_CTR_DT VARCHAR2(100 BYTE)																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for View HOLD_ALLOT_REPORTS																																							
--------------------------------------------------------																																							
																																							
CREATE OR REPLACE FORCE EDITIONABLE VIEW "MS9ABA"."HOLD_ALLOT_REPORTS" ("SECURITY_CODE", "IC_PASSPORT", "ISIN_CODE", "PROCESS_DATE", "APPLICATION_TYPE", "AMOUNT", "SB_NATION", "IS_HLD_ALT", "NATIONALITY", "NATION_CITY") AS																																							
SELECT  aba0231_sb_security_code AS security_code,																																							
aba0223_sb_ic_passport AS passport,																																							
aba0231_sb_isin_code AS isin_code,																																							
TO_CHAR (TO_DATE (aba0230_sb_process_dt, 'YYYYMMDD'),'YYYYMM') AS process_Date,																																							
aba0230_sb_hld_type  AS application_type,																																							
aba0231_sb_hld_amt AS amount,aba0223_sb_cd_nation as nation,'HOLDING' as is_hld_alt,																																							
aba0218_sb_description AS nationality,																																							
aba0218_sb_cd_nation_cty AS nation_city																																							
FROM aba0231_sb_hld_info_dt INNER JOIN aba0230_sb_hld_info																																							
ON aba0231_sb_hld_info_id = aba0230_sb_hld_info_id																																							
INNER JOIN aba0223_sb_applicant																																							
ON aba0231_sb_applicant_id = aba0223_sb_applicant_id																																							
LEFT JOIN aba0218_sb_cd_nation_cty on aba0223_sb_cd_nation_cty = aba0218_sb_cd_nation_cty																																							
																																							
UNION all																																							
SELECT  C.ABA0224_SB_SECURITY_CODE AS security_code,																																							
D.aba0223_sb_ic_passport AS passport,																																							
C.aba0224_sb_isin_code AS isin_code,																																							
TO_CHAR (E.aba0101_sb_result_load_date, 'YYYYMM') AS process_Date,																																							
(case when aba0224_sb_cd_file_type = 'AP1'																																							
THEN 'CAS'																																							
ELSE 'SRS' END)																																							
AS application_type,																																							
A.aba0232_sb_processed_amt AS amount ,aba0223_sb_cd_nation as nation,'ALLOTMENT' as is_hld_alt,																																							
aba0218_sb_description AS nationality,																																							
aba0218_sb_cd_nation_cty AS nation_city																																							
FROM aba0232_sb_allotment_result A,																																							
aba0225_sb_subscript_dt B,																																							
aba0224_sb_subscript C,																																							
aba0223_sb_applicant D,																																							
aba0101_sb_security_master E,																																							
aba0214_sb_cd_file_type F,																																							
aba0218_sb_cd_nation_cty G																																							
WHERE																																							
A.aba0232_sb_processed_amt>0																																							
and A.aba0232_sb_sub_detail_id = B.aba0225_sb_sub_detail_id																																							
AND B.aba0225_sb_sub_id = C.aba0224_sb_sub_id																																							
AND B.aba0225_sb_applicant_id = D.aba0223_sb_applicant_id																																							
AND C.aba0224_sb_security_code = E.aba0101_sb_security_code																																							
AND C.aba0224_sb_isin_code = E.aba0101_sb_isin_code																																							
AND C.aba0224_sb_cd_file_type = F.aba0214_sb_cd_file_type																																							
AND D.aba0223_sb_cd_nation_cty = G.aba0218_sb_cd_nation_cty																																							
	AND TO_CHAR (E.aba0101_sb_result_load_date, 'YYYYMMDD') in																																						
(SELECT MAX(TO_CHAR(aba0101_sb_result_load_date,'YYYYMMDD')) from aba0101_sb_security_master																																							
GROUP BY TRUNC(aba0101_sb_result_load_date, 'MM'))																																							
;																																							
--------------------------------------------------------																																							
--  DDL for View VW_ERF_001																																							
--------------------------------------------------------																																							
																																							
CREATE OR REPLACE FORCE EDITIONABLE VIEW "MS9ABA"."VW_ERF_001" ("TRADE_DATE", "VALUE_DATE", "SPECIFIC_ISSUE", "ALLOTTED", "PD", "1ST_LEG_PROCEEDS_S", "MATURITY", "GENERAL_COLLATERAL", "NOMINAL_GC", "REPO_FEE", "STATUS") AS																																							
SELECT																																							
ABA0605_RECEIVED_DT,																																							
(select ABA0017_REPOT1_DATE from MS9ABA.ABA0017_FINAL_DAILY_PRICE@MNET where ABA0017_SECURITY_CODE = ABA0605_SECURITY_CODE and ABA0017_ISSUE_NO = 1 and to_char(ABA0017_SUBMISSION_DATE, 'dd/mm/yyyy')=to_char(ABA0605_RECEIVED_DT, 'dd/mm/yyyy')),																																							
ABA0605_SECURITY_CODE,																																							
ABA0605_AMT_ALLOTTED,																																							
ABA0605_BANK_CODE,																																							
(ABA0605_DIRTY_PRICE * ABA0605_AMT_ALLOTTED/ 100),																																							
(select ABA0017_REPOT2_DATE from MS9ABA.ABA0017_FINAL_DAILY_PRICE@MNET where ABA0017_SECURITY_CODE = ABA0605_SECURITY_CODE and ABA0017_ISSUE_NO = 1 and to_char(ABA0017_SUBMISSION_DATE, 'dd/mm/yyyy')=to_char(ABA0605_RECEIVED_DT, 'dd/mm/yyyy')),																																							
ABA0605_EXG_SEC_CODE,																																							
ABA0605_EXG_NOMINAL_AMT,																																							
ABA0605_REPO_FEE,																																							
ABA0605_STATUS_FLAG																																							
FROM MS9ABA.ABA0605_TRADE_DETAILS@MNET																																							
;																																							
--------------------------------------------------------																																							
--  DDL for View VW_HLD_001																																							
--------------------------------------------------------																																							
																																							
CREATE OR REPLACE FORCE EDITIONABLE VIEW "MS9ABA"."VW_HLD_001" ("IC_CDP_KEY", "NATION", "CTRY", "BANK", "ISSUE_CD", "HLD_TYPE", "AMT", "PROCESS_DT") AS																																							
SELECT utl_raw.cast_to_varchar2(utl_encode.base64_encode(utl_raw.cast_to_raw(ABA0223_SB_IC_PASSPORT))) AS IC_CDP_Key,																																							
e.ABA0217_SB_DESCRIPTION AS NATION,																																							
c.aba0223_sb_cd_nation_cty AS CTRY,																																							
d.ABA0222_SB_ORG_NAME AS BANK,																																							
b.ABA0231_SB_SECURITY_CODE AS ISSUE_CD,																																							
a.aba0230_sb_hld_type AS HLD_TYPE,																																							
b.ABA0231_SB_HLD_AMT AS AMT,																																							
a.ABA0230_SB_Process_DT AS PROCESS_DT																																							
FROM ABA0230_SB_HLD_INFO a																																							
INNER JOIN ABA0231_SB_HLD_INFO_DT b																																							
ON b.ABA0231_SB_HLD_INFO_ID = a.ABA0230_SB_HLD_INFO_ID																																							
INNER JOIN (select aba0230_sb_org_id, MAX(ABA0230_SB_PROCESS_DT) process_dt from ABA0230_SB_HLD_INFO group by aba0230_sb_org_id) g																																							
on a.aba0230_sb_org_id= g.aba0230_sb_org_id and a.ABA0230_SB_PROCESS_DT= g.PROCESS_DT																																							
INNER JOIN ABA0223_SB_APPLICANT c																																							
ON b.ABA0231_SB_APPLICANT_ID = c.ABA0223_SB_APPLICANT_id																																							
LEFT JOIN aba0222_sb_org d																																							
ON d.aba0222_sb_org_id = a.aba0230_sb_org_id																																							
LEFT JOIN aba0217_sb_cd_nation e																																							
ON c.aba0223_sb_cd_nation = e.aba0217_sb_cd_nation																																							
;																																							
--------------------------------------------------------																																							
--  DDL for View VW_MASTER_001																																							
--------------------------------------------------------																																							
																																							
CREATE OR REPLACE FORCE EDITIONABLE VIEW "MS9ABA"."VW_MASTER_001" ("ISSUE_CD", "ISSUE_NAME", "ISSUE_DATE", "ISSUE_SIZE", "QTY_APPLIED", "CUTOFF_AMT", "MAT_DATE", "INTEREST_RATE", "TENOR", "QTY_ALLOTED", "QTY_REJECTED", "QTY_REDEEMED", "RANDOM_ALLOT_AMT", "RANDOM_ALLOT_RATE") AS																																							
SELECT ABA0101_SB_SECURITY_CODE AS ISSUE_CD,																																							
ABA0101_SB_SECURITY_NAME AS ISSUE_NAME,																																							
ABA0101_SB_ISSUE_DATE AS ISSUE_DATE,																																							
ABA0101_SB_ISSUE_SIZE AS ISSUE_SIZE,																																							
ABA0101_SB_QTY_APPLIED AS QTY_APPLIED,																																							
ABA0101_SB_CUTOFF_AMT AS CUTOFF_AMT,																																							
ABA0101_SB_MATURITY_DATE AS MAT_DATE,																																							
ABA0101_SB_INTEREST_RATE AS INTEREST_RATE,																																							
ABA0101_SB_TENOR AS TENOR,																																							
ABA0101_SB_QTY_ALLOTTED AS QTY_ALLOTED,																																							
ABA0101_SB_QTY_REJECTED AS QTY_REJECTED,																																							
ABA0101_SB_QTY_REDEEMED AS QTY_REDEEMED,																																							
ABA0101_SB_RANDOM_ALLOT_AMT AS RANDOM_ALLOT_AMT,																																							
ABA0101_SB_RANDOM_ALLOT_RATE AS RANDOM_ALLOT_RATE																																							
FROM ms9aba.ABA0101_SB_SECURITY_MASTER																																							
;																																							
--------------------------------------------------------																																							
--  DDL for View VW_QA_HLD_001																																							
--------------------------------------------------------																																							
																																							
CREATE OR REPLACE FORCE EDITIONABLE VIEW "MS9ABA"."VW_QA_HLD_001" ("IC_CDP_KEY", "NATION", "CTRY", "BANK", "ISSUE_CD", "HLD_TYPE", "AMT", "PROCESS_DT") AS																																							
SELECT SUBSTR (c.aba0223_sb_ic_passport, -5)																																							
|| SUBSTR (B.ABA0231_SB_CDP_ACCT_NO, -6)																																							
AS IC_CDP_Key,																																							
e.ABA0217_SB_DESCRIPTION AS NATION,																																							
c.aba0223_sb_cd_nation_cty AS CTRY,																																							
d.ABA0222_SB_ORG_NAME AS BANK,																																							
b.ABA0231_SB_SECURITY_CODE AS ISSUE_CD,																																							
a.aba0230_sb_hld_type AS HLD_TYPE,																																							
b.ABA0231_SB_HLD_AMT AS AMT,																																							
a.ABA0230_SB_Process_DT AS PROCESS_DT																																							
FROM ABA0230_SB_HLD_INFO a																																							
INNER JOIN ABA0231_SB_HLD_INFO_DT b																																							
ON b.ABA0231_SB_HLD_INFO_ID = a.ABA0230_SB_HLD_INFO_ID																																							
INNER JOIN ABA0223_SB_APPLICANT c																																							
ON b.ABA0231_SB_APPLICANT_ID = c.ABA0223_SB_APPLICANT_id																																							
LEFT JOIN aba0222_sb_org d																																							
ON d.aba0222_sb_org_id = a.aba0230_sb_org_id																																							
LEFT JOIN aba0217_sb_cd_nation e																																							
ON c.aba0223_sb_cd_nation = e.aba0217_sb_cd_nation																																							
;																																							
--------------------------------------------------------																																							
--  DDL for View VW_QA_MASTER_001																																							
--------------------------------------------------------																																							
																																							
CREATE OR REPLACE FORCE EDITIONABLE VIEW "MS9ABA"."VW_QA_MASTER_001" ("ISSUE_CD", "ISSUE_NAME", "ISSUE_DATE", "ISSUE_SIZE", "QTY_APPLIED", "CUTOFF_AMT", "MAT_DATE", "INTEREST_RATE", "TENOR", "QTY_ALLOTED", "QTY_REJECTED", "QTY_REDEEMED", "RANDOM_ALLOT_AMT", "RANDOM_ALLOT_RATE") AS																																							
SELECT ABA0101_SB_SECURITY_CODE AS ISSUE_CD,																																							
ABA0101_SB_SECURITY_NAME AS ISSUE_NAME,																																							
ABA0101_SB_ISSUE_DATE AS ISSUE_DATE,																																							
ABA0101_SB_ISSUE_SIZE AS ISSUE_SIZE,																																							
ABA0101_SB_QTY_APPLIED AS QTY_APPLIED,																																							
ABA0101_SB_CUTOFF_AMT AS CUTOFF_AMT,																																							
ABA0101_SB_MATURITY_DATE AS MAT_DATE,																																							
ABA0101_SB_INTEREST_RATE AS INTEREST_RATE,																																							
ABA0101_SB_TENOR AS TENOR,																																							
ABA0101_SB_QTY_ALLOTTED AS QTY_ALLOTED,																																							
ABA0101_SB_QTY_REJECTED AS QTY_REJECTED,																																							
ABA0101_SB_QTY_REDEEMED AS QTY_REDEEMED,																																							
ABA0101_SB_RANDOM_ALLOT_AMT AS RANDOM_ALLOT_AMT,																																							
ABA0101_SB_RANDOM_ALLOT_RATE AS RANDOM_ALLOT_RATE																																							
FROM ms9aba.ABA0101_SB_SECURITY_MASTER																																							
;																																							
--------------------------------------------------------																																							
--  DDL for View VW_QA_REDEM_001																																							
--------------------------------------------------------																																							
																																							
CREATE OR REPLACE FORCE EDITIONABLE VIEW "MS9ABA"."VW_QA_REDEM_001" ("IC_CDP_KEY", "NATION", "CTRY", "ISSUE_CD", "RCV_DT", "RCV_TM", "RDM_AMT", "BANK", "STATUS", "APP_TYPE", "RDM_TYPE") AS																																							
SELECT SUBSTR (c.aba0223_sb_ic_passport, -5)																																							
|| SUBSTR (B.ABA0228_SB_CDP_ACCT_NO, -6)																																							
AS IC_CDP_Key,																																							
e.ABA0217_SB_DESCRIPTION AS NATION,																																							
c.aba0223_sb_cd_nation_cty AS CTRY,																																							
b.ABA0228_SB_SECURITY_CODE AS ISSUE_CD,																																							
b.ABA0228_SB_RECEIVED_DT AS RCV_DT,																																							
b.ABA0228_SB_RECEIVED_TIME AS RCV_TM,																																							
b.ABA0228_SB_NOMINAL_AMT AS RDM_AMT,																																							
d.ABA0222_SB_ORG_NAME AS BANK,																																							
b.ABA0228_SB_CD_RECORD_STATUS AS STATUS,																																							
i.aba0214_sb_description AS APP_TYPE,																																							
d.ABA0240_SB_DESCRIPTION AS RDM_TYPE																																							
FROM aba0227_sb_redemption a																																							
INNER JOIN aba0228_sb_redemption_dt b																																							
ON b.aba0228_sb_redem_id = a.aba0227_sb_redem_id																																							
INNER JOIN ABA0223_SB_APPLICANT c																																							
ON b.ABA0228_SB_APPLICANT_ID = c.ABA0223_SB_APPLICANT_id																																							
INNER JOIN ABA0240_SB_CD_SUBMISSION_TYPE d																																							
ON d.ABA0240_SB_CD_SUBMIT_TYPE = b.ABA0228_SB_SUB_METHOD																																							
LEFT JOIN aba0217_sb_cd_nation e																																							
ON c.aba0223_sb_cd_nation = e.aba0217_sb_cd_nation																																							
LEFT JOIN aba0222_sb_org d																																							
ON b.ABA0228_SB_CUST_BANK_CODE = d.aba0222_sb_org_code																																							
LEFT JOIN aba0214_sb_cd_file_type i																																							
ON a.aba0227_sb_cd_file_type = i.aba0214_sb_cd_file_type																																							
ORDER BY IC_CDP_Key, rcv_dt, rcv_tm																																							
;																																							
--------------------------------------------------------																																							
--  DDL for View VW_QA_SUB_001																																							
--------------------------------------------------------																																							
																																							
CREATE OR REPLACE FORCE EDITIONABLE VIEW "MS9ABA"."VW_QA_SUB_001" ("ISSUE_CD", "IC_CDP_KEY", "AGE", "RECEIVED_DT", "RECEIVED_TM", "SUBMITTED_AMT", "ACCEPTED_AMT", "ALLOTED_AMT", "BANK", "NATIONALITY", "RESIDENCY", "APP_TYPE", "APP_CHANNEL", "ALLOT_STATUS", "ALLOT_FAIL_REASON") AS																																							
SELECT h.aba0224_sb_security_code AS ISSUE_CD,																																							
SUBSTR (c.aba0223_sb_ic_passport, -5)																																							
|| SUBSTR (b.ABA0225_SB_CDP_ACCT_NO, -6)																																							
AS IC_CDP_Key,																																							
CASE																																							
WHEN ABA0223_SB_CD_NATION in ('S','P') and SUBSTR (c.aba0223_sb_ic_passport, 1, 1)='S' and SUBSTR (c.aba0223_sb_ic_passport, 2, 2) >= 68																																							
ThEN																																							
100																																							
- TO_NUMBER(SUBSTR (c.aba0223_sb_ic_passport, 2, 2))																																							
#ERROR!																																							
WHEN ABA0223_SB_CD_NATION in ('S','P') and SUBSTR (c.aba0223_sb_ic_passport, 1, 1)='T'																																							
ThEN																																							
TO_NUMBER(TO_CHAR (SYSDATE, 'YY'))																																							
- TO_NUMBER(SUBSTR (c.aba0223_sb_ic_passport, 2, 2))																																							
ELSE																																							
NULL																																							
END																																							
AS AGE,																																							
b.ABA0225_SB_RECEIVED_DT AS RECEIVED_DT,																																							
b.ABA0225_SB_RECEIVED_TIME AS RECEIVED_TM,																																							
b.ABA0225_SB_NOMINAL_AMT AS SUBMITTED_AMT,																																							
a.ABA0232_SB_ACCEPTED_AMT AS ACCEPTED_AMT,																																							
a.ABA0232_SB_PROCESSED_AMT AS ALLOTED_AMT,																																							
d.ABA0222_SB_ORG_NAME AS BANK,																																							
e.ABA0217_SB_DESCRIPTION AS NATIONALITY,																																							
c.ABA0223_SB_CD_NATION_CTY AS RESIDENCY,																																							
i.aba0214_sb_description AS APP_TYPE,																																							
f.aba0240_sb_description AS APP_CHANNEL,																																							
g.aba0216_sb_description AS ALLOT_STATUS,																																							
j.ABA0220_SB_DESCRIPTION																																							
FROM ABA0225_SB_SUBSCRIPT_DT b																																							
INNER JOIN aba0224_sb_subscript h																																							
ON b.aba0225_sb_sub_id = h.aba0224_sb_sub_id																																							
INNER JOIN ABA0223_SB_APPLICANT c																																							
ON b.ABA0225_SB_APPLICANT_ID = c.ABA0223_SB_APPLICANT_ID																																							
LEFT JOIN ABA0232_SB_ALLOTMENT_RESULT a																																							
ON b.ABA0225_SB_SUB_DETAIL_ID = a.ABA0232_SB_SUB_DETAIL_ID																																							
LEFT JOIN ABA0220_SB_CD_RECORD_ERR_DESC j																																							
ON a.ABA0232_SB_CD_RECORD_ERR_DESC =																																							
j.ABA0220_SB_CD_RECORD_ERR_DESC																																							
LEFT JOIN aba0222_sb_org d																																							
ON b.ABA0225_SB_CUST_BANK_CODE = d.aba0222_sb_org_code																																							
LEFT JOIN aba0217_sb_cd_nation e																																							
ON c.ABA0223_SB_CD_NATION = e.aba0217_sb_cd_nation																																							
LEFT JOIN aba0240_sb_cd_submission_type f																																							
ON b.aba0225_sb_sub_method = f.aba0240_sb_cd_submit_type																																							
LEFT JOIN aba0216_sb_cd_record_status g																																							
ON g.aba0216_sb_cd_record_status = a.aba0232_sb_cd_record_status																																							
LEFT JOIN aba0214_sb_cd_file_type i																																							
ON h.aba0224_sb_cd_file_type = i.aba0214_sb_cd_file_type																																							
ORDER BY ISSUE_CD, received_dt, received_tm																																							
;																																							
--------------------------------------------------------																																							
--  DDL for View VW_REDEM_001																																							
--------------------------------------------------------																																							
																																							
CREATE OR REPLACE FORCE EDITIONABLE VIEW "MS9ABA"."VW_REDEM_001" ("IC_CDP_KEY", "NATION", "CTRY", "ISSUE_CD", "RCV_DT", "RCV_TM", "RDM_AMT", "BANK", "STATUS", "APP_TYPE", "RDM_TYPE") AS																																							
SELECT utl_raw.cast_to_varchar2(utl_encode.base64_encode(utl_raw.cast_to_raw(ABA0223_SB_IC_PASSPORT))) AS IC_CDP_Key,																																							
e.ABA0217_SB_DESCRIPTION AS NATION,																																							
c.aba0223_sb_cd_nation_cty AS CTRY,																																							
b.ABA0228_SB_SECURITY_CODE AS ISSUE_CD,																																							
b.ABA0228_SB_RECEIVED_DT AS RCV_DT,																																							
b.ABA0228_SB_RECEIVED_TIME AS RCV_TM,																																							
b.ABA0228_SB_NOMINAL_AMT AS RDM_AMT,																																							
d.ABA0222_SB_ORG_NAME AS BANK,																																							
b.ABA0228_SB_CD_RECORD_STATUS AS STATUS,																																							
i.aba0214_sb_description AS APP_TYPE,																																							
d.ABA0240_SB_DESCRIPTION AS RDM_TYPE																																							
FROM aba0227_sb_redemption a																																							
INNER JOIN aba0228_sb_redemption_dt b																																							
ON b.aba0228_sb_redem_id = a.aba0227_sb_redem_id																																							
INNER JOIN ABA0223_SB_APPLICANT c																																							
ON b.ABA0228_SB_APPLICANT_ID = c.ABA0223_SB_APPLICANT_id																																							
INNER JOIN ABA0240_SB_CD_SUBMISSION_TYPE d																																							
ON d.ABA0240_SB_CD_SUBMIT_TYPE = b.ABA0228_SB_SUB_METHOD																																							
LEFT JOIN aba0217_sb_cd_nation e																																							
ON c.aba0223_sb_cd_nation = e.aba0217_sb_cd_nation																																							
LEFT JOIN aba0222_sb_org d																																							
ON b.ABA0228_SB_CUST_BANK_CODE = d.aba0222_sb_org_code																																							
LEFT JOIN aba0214_sb_cd_file_type i																																							
ON a.aba0227_sb_cd_file_type = i.aba0214_sb_cd_file_type																																							
ORDER BY IC_CDP_Key, rcv_dt, rcv_tm																																							
;																																							
--------------------------------------------------------																																							
--  DDL for View VW_SUB_001																																							
--------------------------------------------------------																																							
																																							
CREATE OR REPLACE FORCE EDITIONABLE VIEW "MS9ABA"."VW_SUB_001" ("ISSUE_CD", "IC_CDP_KEY", "AGE", "RECEIVED_DT", "RECEIVED_TM", "SUBMITTED_AMT", "ACCEPTED_AMT", "ALLOTED_AMT", "BANK", "NATIONALITY", "RESIDENCY", "APP_TYPE", "APP_CHANNEL", "ALLOT_STATUS", "ALLOT_FAIL_REASON") AS																																							
SELECT h.aba0224_sb_security_code AS ISSUE_CD,																																							
utl_raw.cast_to_varchar2(utl_encode.base64_encode(utl_raw.cast_to_raw(ABA0223_SB_IC_PASSPORT))) AS IC_CDP_Key,																																							
CASE																																							
WHEN ABA0223_SB_CD_NATION in ('S','P') and SUBSTR (c.aba0223_sb_ic_passport, 1, 1)='S' and SUBSTR (c.aba0223_sb_ic_passport, 2, 2) >= 68																																							
ThEN																																							
100																																							
- TO_NUMBER(SUBSTR (c.aba0223_sb_ic_passport, 2, 2))																																							
#ERROR!																																							
WHEN ABA0223_SB_CD_NATION in ('S','P') and SUBSTR (c.aba0223_sb_ic_passport, 1, 1)='T'																																							
ThEN																																							
TO_NUMBER(TO_CHAR (SYSDATE, 'YY'))																																							
- TO_NUMBER(SUBSTR (c.aba0223_sb_ic_passport, 2, 2))																																							
WHEN ABA0223_SB_CD_NATION in ('S','P') and SUBSTR (c.aba0223_sb_ic_passport, 1, 1)='S' and SUBSTR (c.aba0223_sb_ic_passport, 2, 2) < 68																																							
ThEN																																							
100																																							
ELSE																																							
NULL																																							
END																																							
AS AGE,																																							
b.ABA0225_SB_RECEIVED_DT AS RECEIVED_DT,																																							
b.ABA0225_SB_RECEIVED_TIME AS RECEIVED_TM,																																							
b.ABA0225_SB_NOMINAL_AMT AS SUBMITTED_AMT,																																							
a.ABA0232_SB_ACCEPTED_AMT AS ACCEPTED_AMT,																																							
a.ABA0232_SB_PROCESSED_AMT AS ALLOTED_AMT,																																							
d.ABA0222_SB_ORG_NAME AS BANK,																																							
e.ABA0217_SB_DESCRIPTION AS NATIONALITY,																																							
c.ABA0223_SB_CD_NATION_CTY AS RESIDENCY,																																							
i.aba0214_sb_description AS APP_TYPE,																																							
f.aba0240_sb_description AS APP_CHANNEL,																																							
g.aba0216_sb_description AS ALLOT_STATUS,																																							
j.ABA0220_SB_DESCRIPTION																																							
FROM ABA0225_SB_SUBSCRIPT_DT b																																							
INNER JOIN aba0224_sb_subscript h																																							
ON b.aba0225_sb_sub_id = h.aba0224_sb_sub_id																																							
INNER JOIN ABA0223_SB_APPLICANT c																																							
ON b.ABA0225_SB_APPLICANT_ID = c.ABA0223_SB_APPLICANT_ID																																							
LEFT JOIN ABA0232_SB_ALLOTMENT_RESULT a																																							
ON b.ABA0225_SB_SUB_DETAIL_ID = a.ABA0232_SB_SUB_DETAIL_ID																																							
LEFT JOIN ABA0220_SB_CD_RECORD_ERR_DESC j																																							
ON a.ABA0232_SB_CD_RECORD_ERR_DESC =																																							
j.ABA0220_SB_CD_RECORD_ERR_DESC																																							
LEFT JOIN aba0222_sb_org d																																							
ON b.ABA0225_SB_CUST_BANK_CODE = d.aba0222_sb_org_code																																							
LEFT JOIN aba0217_sb_cd_nation e																																							
ON c.ABA0223_SB_CD_NATION = e.aba0217_sb_cd_nation																																							
LEFT JOIN aba0240_sb_cd_submission_type f																																							
ON b.aba0225_sb_sub_method = f.aba0240_sb_cd_submit_type																																							
LEFT JOIN aba0216_sb_cd_record_status g																																							
ON g.aba0216_sb_cd_record_status = a.aba0232_sb_cd_record_status																																							
LEFT JOIN aba0214_sb_cd_file_type i																																							
ON h.aba0224_sb_cd_file_type = i.aba0214_sb_cd_file_type																																							
ORDER BY ISSUE_CD, received_dt, received_tm																																							
;																																							
--------------------------------------------------------																																							
--  DDL for View VW_SUB_002																																							
--------------------------------------------------------																																							
																																							
CREATE OR REPLACE FORCE EDITIONABLE VIEW "MS9ABA"."VW_SUB_002" ("ISSUE_CD", "IC_CDP_KEY", "RECEIVED_DT", "RECEIVED_TM", "SUBMITTED_AMT", "BANK", "NATIONALITY", "RESIDENCY", "APP_TYPE", "APP_CHANNEL") AS																																							
SELECT h.aba0224_sb_security_code AS ISSUE_CD,																																							
utl_raw.cast_to_varchar2(utl_encode.base64_encode(utl_raw.cast_to_raw(ABA0223_SB_IC_PASSPORT))) AS IC_CDP_Key,																																							
b.ABA0225_SB_RECEIVED_DT AS RECEIVED_DT,																																							
b.ABA0225_SB_RECEIVED_TIME AS RECEIVED_TM,																																							
b.ABA0225_SB_NOMINAL_AMT AS SUBMITTED_AMT,																																							
d.ABA0222_SB_ORG_NAME AS BANK,																																							
e.ABA0217_SB_DESCRIPTION AS NATIONALITY,																																							
c.ABA0223_SB_CD_NATION_CTY AS RESIDENCY,																																							
i.aba0214_sb_description AS APP_TYPE,																																							
f.aba0240_sb_description AS APP_CHANNEL																																							
FROM aba0224_sb_subscript h																																							
INNER JOIN ABA0225_SB_SUBSCRIPT_DT b																																							
ON h.aba0224_sb_sub_id = b.aba0225_sb_sub_id																																							
INNER JOIN ABA0223_SB_APPLICANT c																																							
ON b.ABA0225_SB_APPLICANT_ID = c.ABA0223_SB_APPLICANT_ID																																							
LEFT JOIN aba0222_sb_org d																																							
ON b.ABA0225_SB_CUST_BANK_CODE = d.aba0222_sb_org_code																																							
LEFT JOIN aba0217_sb_cd_nation e																																							
ON c.ABA0223_SB_CD_NATION = e.aba0217_sb_cd_nation																																							
LEFT JOIN aba0240_sb_cd_submission_type f																																							
ON b.aba0225_sb_sub_method = f.aba0240_sb_cd_submit_type																																							
LEFT JOIN aba0214_sb_cd_file_type i																																							
ON h.aba0224_sb_cd_file_type = i.aba0214_sb_cd_file_type																																							
ORDER BY ISSUE_CD, received_dt, received_tm																																							
;																																							
--------------------------------------------------------																																							
--  DDL for Index ABA0212_PK_INDEX																																							
--------------------------------------------------------																																							
																																							
CREATE UNIQUE INDEX "MS9ABA"."ABA0212_PK_INDEX" ON "MS9ABA"."ABA0212_SB_REPORT" ("ABA0212_SB_REPORT_ID")																																							
PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Index ABA0213_PK_INDEX																																							
--------------------------------------------------------																																							
																																							
CREATE UNIQUE INDEX "MS9ABA"."ABA0213_PK_INDEX" ON "MS9ABA"."ABA0213_SB_REPORT_FILE" ("ABA0213_SB_REPORT_FILE_ID")																																							
PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Index ABA0214_PK_INDEX																																							
--------------------------------------------------------																																							
																																							
CREATE UNIQUE INDEX "MS9ABA"."ABA0214_PK_INDEX" ON "MS9ABA"."ABA0214_SB_CD_FILE_TYPE" ("ABA0214_SB_CD_FILE_TYPE")																																							
PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Index ABA0215_PK_INDEX																																							
--------------------------------------------------------																																							
																																							
CREATE UNIQUE INDEX "MS9ABA"."ABA0215_PK_INDEX" ON "MS9ABA"."ABA0215_SB_CD_FILE_STATUS" ("ABA0215_SB_CD_FILE_STATUS")																																							
PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Index ABA0216_PK_INDEX																																							
--------------------------------------------------------																																							
																																							
CREATE UNIQUE INDEX "MS9ABA"."ABA0216_PK_INDEX" ON "MS9ABA"."ABA0216_SB_CD_RECORD_STATUS" ("ABA0216_SB_CD_RECORD_STATUS")																																							
PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Index ABA0217_PK_INDEX																																							
--------------------------------------------------------																																							
																																							
CREATE UNIQUE INDEX "MS9ABA"."ABA0217_PK_INDEX" ON "MS9ABA"."ABA0217_SB_CD_NATION" ("ABA0217_SB_CD_NATION")																																							
PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Index ABA0218_PK_INDEX																																							
--------------------------------------------------------																																							
																																							
CREATE UNIQUE INDEX "MS9ABA"."ABA0218_PK_INDEX" ON "MS9ABA"."ABA0218_SB_CD_NATION_CTY" ("ABA0218_SB_CD_NATION_CTY")																																							
PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Index ABA0219_PK_INDEX																																							
--------------------------------------------------------																																							
																																							
CREATE UNIQUE INDEX "MS9ABA"."ABA0219_PK_INDEX" ON "MS9ABA"."ABA0219_SB_CD_FILE_ERROR_DESC" ("ABA0219_SB_CD_FILE_ERR_DESC")																																							
PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Index ABA0220_PK_INDEX																																							
--------------------------------------------------------																																							
																																							
CREATE UNIQUE INDEX "MS9ABA"."ABA0220_PK_INDEX" ON "MS9ABA"."ABA0220_SB_CD_RECORD_ERR_DESC" ("ABA0220_SB_CD_RECORD_ERR_DESC")																																							
PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Index ABA0221_PK_INDEX																																							
--------------------------------------------------------																																							
																																							
CREATE UNIQUE INDEX "MS9ABA"."ABA0221_PK_INDEX" ON "MS9ABA"."ABA0221_SB_CD_BATCHJOB_STATUS" ("ABA0221_SB_CD_BATCHJOB_STATUS")																																							
PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Index ABA0222_PK_INDEX																																							
--------------------------------------------------------																																							
																																							
CREATE UNIQUE INDEX "MS9ABA"."ABA0222_PK_INDEX" ON "MS9ABA"."ABA0222_SB_ORG" ("ABA0222_SB_ORG_ID")																																							
PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Index ABA0223_PK_INDEX																																							
--------------------------------------------------------																																							
																																							
CREATE UNIQUE INDEX "MS9ABA"."ABA0223_PK_INDEX" ON "MS9ABA"."ABA0223_SB_APPLICANT" ("ABA0223_SB_APPLICANT_ID")																																							
PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 27262976 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Index ABA0224_PK_INDEX																																							
--------------------------------------------------------																																							
																																							
CREATE UNIQUE INDEX "MS9ABA"."ABA0224_PK_INDEX" ON "MS9ABA"."ABA0224_SB_SUBSCRIPT" ("ABA0224_SB_SUB_ID")																																							
PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Index ABA0225_PK_INDEX																																							
--------------------------------------------------------																																							
																																							
CREATE UNIQUE INDEX "MS9ABA"."ABA0225_PK_INDEX" ON "MS9ABA"."ABA0225_SB_SUBSCRIPT_DT" ("ABA0225_SB_SUB_DETAIL_ID")																																							
PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 32505856 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Index ABA0226_PK_INDEX																																							
--------------------------------------------------------																																							
																																							
CREATE UNIQUE INDEX "MS9ABA"."ABA0226_PK_INDEX" ON "MS9ABA"."ABA0226_SB_SUBSCRIPT_DT_ERR" ("ABA0226_SB_SUB_DT_ERR_ID")																																							
PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Index ABA0227_PK_INDEX																																							
--------------------------------------------------------																																							
																																							
CREATE UNIQUE INDEX "MS9ABA"."ABA0227_PK_INDEX" ON "MS9ABA"."ABA0227_SB_REDEMPTION" ("ABA0227_SB_REDEM_ID")																																							
PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Index ABA0228_PK_INDEX																																							
--------------------------------------------------------																																							
																																							
CREATE UNIQUE INDEX "MS9ABA"."ABA0228_PK_INDEX" ON "MS9ABA"."ABA0228_SB_REDEMPTION_DT" ("ABA0228_SB_REDEM_DT_ID")																																							
PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 15728640 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Index ABA0229_PK_INDEX																																							
--------------------------------------------------------																																							
																																							
CREATE UNIQUE INDEX "MS9ABA"."ABA0229_PK_INDEX" ON "MS9ABA"."ABA0229_SB_REDEMPTION_DT_ERR" ("ABA0229_SB_REDEM_DT_ERR_ID")																																							
PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 2097152 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Index ABA0230_PK_INDEX																																							
--------------------------------------------------------																																							
																																							
CREATE UNIQUE INDEX "MS9ABA"."ABA0230_PK_INDEX" ON "MS9ABA"."ABA0230_SB_HLD_INFO" ("ABA0230_SB_HLD_INFO_ID")																																							
PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Index ABA0231_PK_INDEX																																							
--------------------------------------------------------																																							
																																							
CREATE UNIQUE INDEX "MS9ABA"."ABA0231_PK_INDEX" ON "MS9ABA"."ABA0231_SB_HLD_INFO_DT" ("ABA0231_SB_HLD_INFO_DT_ID")																																							
PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 7340032 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Index ABA0232_PK_INDEX																																							
--------------------------------------------------------																																							
																																							
CREATE UNIQUE INDEX "MS9ABA"."ABA0232_PK_INDEX" ON "MS9ABA"."ABA0232_SB_ALLOTMENT_RESULT" ("ABA0232_SB_ALLOT_RESULT_ID")																																							
PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 23068672 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Index ABA0233_PK_INDEX																																							
--------------------------------------------------------																																							
																																							
CREATE UNIQUE INDEX "MS9ABA"."ABA0233_PK_INDEX" ON "MS9ABA"."ABA0233_SB_BATCH_JOB" ("ABA0233_SB_JOB_ID")																																							
PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Index ABA0234_PK_INDEX																																							
--------------------------------------------------------																																							
																																							
CREATE UNIQUE INDEX "MS9ABA"."ABA0234_PK_INDEX" ON "MS9ABA"."ABA0234_SB_BATCH_JOB_EXECUTION" ("ABA0234_SB_JOB_EXECUTION_ID")																																							
PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Index BATCH_STEP_EXECUTION_PK_INDEX																																							
--------------------------------------------------------																																							
																																							
CREATE UNIQUE INDEX "MS9ABA"."BATCH_STEP_EXECUTION_PK_INDEX" ON "MS9ABA"."BATCH_STEP_EXECUTION" ("STEP_EXECUTION_ID")																																							
PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Index UK_ABA0010																																							
--------------------------------------------------------																																							
																																							
CREATE UNIQUE INDEX "MS9ABA"."UK_ABA0010" ON "MS9ABA"."ABA0010_EAUCTION_AUCTION_CUTOFF_TIME" ("ABA0010_NAME")																																							
PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Index UK_ABA0036																																							
--------------------------------------------------------																																							
																																							
CREATE UNIQUE INDEX "MS9ABA"."UK_ABA0036" ON "MS9ABA"."ABA0036_RETAILBID_FILE" ("ABA0036_FILE_NAME", "ABA0036_PROCESSING_DATE", "ABA0036_ACKNOWLEDGEMENT_FILE_NAME")																																							
PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Index UK_P3N9Y6IE1MYL1GN8MJITY9F0X																																							
--------------------------------------------------------																																							
																																							
CREATE UNIQUE INDEX "MS9ABA"."UK_P3N9Y6IE1MYL1GN8MJITY9F0X" ON "MS9ABA"."ABA0223_SB_APPLICANT" ("ABA0223_SB_IC_PASSPORT", "ABA0223_SB_NAME_OF_APPLN", "ABA0223_SB_CD_NATION", "ABA0223_SB_CD_NATION_CTY")																																							
PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 126877696 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Index BJEC_PK_INDEX																																							
--------------------------------------------------------																																							
																																							
CREATE UNIQUE INDEX "MS9ABA"."BJEC_PK_INDEX" ON "MS9ABA"."BATCH_JOB_EXECUTION_CONTEXT" ("JOB_EXECUTION_ID")																																							
PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Index BSEC_PK_INDEX																																							
--------------------------------------------------------																																							
																																							
CREATE UNIQUE INDEX "MS9ABA"."BSEC_PK_INDEX" ON "MS9ABA"."BATCH_STEP_EXECUTION_CONTEXT" ("STEP_EXECUTION_ID")																																							
PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Index JOB_INST_UN																																							
--------------------------------------------------------																																							
																																							
CREATE UNIQUE INDEX "MS9ABA"."JOB_INST_UN" ON "MS9ABA"."BATCH_JOB_INSTANCE" ("JOB_NAME", "JOB_KEY")																																							
PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Index PK_ ABA0009_EAUCTION_CONFIG																																							
--------------------------------------------------------																																							
																																							
CREATE UNIQUE INDEX "MS9ABA"."PK_ ABA0009_EAUCTION_CONFIG" ON "MS9ABA"."ABA0009_EAUCTION_CONFIG" ("ABA0009_KEY")																																							
PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Index PK_ABA0001_SECURITY_MASTER																																							
--------------------------------------------------------																																							
																																							
CREATE UNIQUE INDEX "MS9ABA"."PK_ABA0001_SECURITY_MASTER" ON "MS9ABA"."ABA0001_SECURITY_MASTER" ("ABA0001_SECURITY_CODE", "ABA0001_ISSUE_NO")																																							
PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 1048576 NEXT 32768 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Index PK_ABA0006_AUCTION_RESULT																																							
--------------------------------------------------------																																							
																																							
CREATE UNIQUE INDEX "MS9ABA"."PK_ABA0006_AUCTION_RESULT" ON "MS9ABA"."ABA0006_AUCTION_RESULT" ("ABA0006_SECURITY_CODE", "ABA0006_ISSUE_NO", "ABA0006_BANK_ACC_CODE", "ABA0006_TENDER_DATE", "ABA0006_LINE_NO")																																							
PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 8388608 NEXT 32768 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Index PK_ABA0007_IND_AUCT_RESULT																																							
--------------------------------------------------------																																							
																																							
CREATE UNIQUE INDEX "MS9ABA"."PK_ABA0007_IND_AUCT_RESULT" ON "MS9ABA"."ABA0007_DETAIL_AUCTION_RESULT" ("ABA0007_SECURITY_CODE", "ABA0007_ISSUE_NO", "ABA0007_FORM_NO")																																							
PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Index PK_ABA0009_EAUCTION_CONFIG_TMP																																							
--------------------------------------------------------																																							
																																							
CREATE UNIQUE INDEX "MS9ABA"."PK_ABA0009_EAUCTION_CONFIG_TMP" ON "MS9ABA"."ABA0009_EAUCTION_CONFIG_TMP" ("ABA0009_KEY")																																							
PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 65536 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Index PK_ABA0035_SECURITY_MASTER_CTG_STG																																							
--------------------------------------------------------																																							
																																							
CREATE UNIQUE INDEX "MS9ABA"."PK_ABA0035_SECURITY_MASTER_CTG_STG" ON "MS9ABA"."ABA0035_SECURITY_MASTER_CTG_STG" ("ABA0035_SECURITY_CODE", "ABA0035_ISSUE_NO")																																							
PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Index PK_AQA0002_TRANSACTION																																							
--------------------------------------------------------																																							
																																							
CREATE UNIQUE INDEX "MS9ABA"."PK_AQA0002_TRANSACTION" ON "MS9ABA"."AQA0002_TRANSACTION_20231209" ("AQA0002_SECURITY_CODE", "AQA0002_ISSUE_NO", "AQA0002_FORM_NO")																																							
PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 1048576 NEXT 32768 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Index PK_AQA0002_TRANSACTION_1																																							
--------------------------------------------------------																																							
																																							
CREATE UNIQUE INDEX "MS9ABA"."PK_AQA0002_TRANSACTION_1" ON "MS9ABA"."AQA0002_TRANSACTION" ("AQA0002_SECURITY_CODE", "AQA0002_ISSUE_NO", "AQA0002_FORM_NO")																																							
PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 1048576 NEXT 32768 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Index PK_AQA0003_USER																																							
--------------------------------------------------------																																							
																																							
CREATE UNIQUE INDEX "MS9ABA"."PK_AQA0003_USER" ON "MS9ABA"."AQA0003_USER" ("AQA0003_USER_ID")																																							
PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 32768 NEXT 32768 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Index PK_AQA0004_LEVEL_ACTION																																							
--------------------------------------------------------																																							
																																							
CREATE UNIQUE INDEX "MS9ABA"."PK_AQA0004_LEVEL_ACTION" ON "MS9ABA"."AQA0004_LEVEL_ACTION" ("AQA0004_LEVEL", "AQA0004_MODULE", "AQA0004_ACTION")																																							
PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Index PK_AQA0005_REPORT_COUNTER																																							
--------------------------------------------------------																																							
																																							
CREATE UNIQUE INDEX "MS9ABA"."PK_AQA0005_REPORT_COUNTER" ON "MS9ABA"."AQA0005_REPORT_COUNTER" ("AQA0005_DATE", "AQA0005_COUNT")																																							
PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 1048576 NEXT 32768 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Index PK_AQA0006_EAPPS_TRANSACTION																																							
--------------------------------------------------------																																							
																																							
CREATE UNIQUE INDEX "MS9ABA"."PK_AQA0006_EAPPS_TRANSACTION" ON "MS9ABA"."AQA0006_EAPPS_TRANSACTION" ("AQA0006_SECURITY_CODE", "AQA0006_ISSUE_NO", "AQA0006_REFERENCE_NO")																																							
PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 1048576 NEXT 32768 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Index PK_AQA0007_COPY_SEC_MASTER_IND																																							
--------------------------------------------------------																																							
																																							
CREATE UNIQUE INDEX "MS9ABA"."PK_AQA0007_COPY_SEC_MASTER_IND" ON "MS9ABA"."AQA0007_COPY_SEC_MASTER_IND" ("AQA0007_DATA_DATE")																																							
PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 1048576 NEXT 32768 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Index PK_AQA0008_SEC_AUCTION_PARA																																							
--------------------------------------------------------																																							
																																							
CREATE UNIQUE INDEX "MS9ABA"."PK_AQA0008_SEC_AUCTION_PARA" ON "MS9ABA"."AQA0008_SEC_AUCTION_PARA" ("AQA0008_SECURITY_CODE", "AQA0008_ISSUE_NO")																																							
PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 1048576 NEXT 32768 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Index PK_AQA0009_SEC_AUCTION_PARA_CTG_STG																																							
--------------------------------------------------------																																							
																																							
CREATE UNIQUE INDEX "MS9ABA"."PK_AQA0009_SEC_AUCTION_PARA_CTG_STG" ON "MS9ABA"."AQA0009_SEC_AUCTION_PARA_CTG_STG" ("AQA0009_SECURITY_CODE", "AQA0009_ISSUE_NO")																																							
PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Index PK_AQA0010_ACTION_REF																																							
--------------------------------------------------------																																							
																																							
CREATE UNIQUE INDEX "MS9ABA"."PK_AQA0010_ACTION_REF" ON "MS9ABA"."AQA0010_ACTION_REF" ("AQA0010_MODULE", "AQA0010_ACTION")																																							
PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Index PK_AQA0012_SYN_INS_RET_DT																																							
--------------------------------------------------------																																							
																																							
CREATE UNIQUE INDEX "MS9ABA"."PK_AQA0012_SYN_INS_RET_DT" ON "MS9ABA"."AQA0012_SYNDICATION_INS_RET_DT" ("AQA0012_SECURITY_CODE", "AQA0012_ISSUE_NO", "AQA0012_FORM_NO", "AQA0012_FILE_TYPE")																																							
PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 32768 NEXT 32768 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Index PK_AQA0013_SYN_COUPON_DT																																							
--------------------------------------------------------																																							
																																							
CREATE UNIQUE INDEX "MS9ABA"."PK_AQA0013_SYN_COUPON_DT" ON "MS9ABA"."AQA0013_SYNDICATION_COUPON_DT" ("AQA0013_SECURITY_CODE", "AQA0013_ISSUE_NO")																																							
PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 32768 NEXT 32768 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Index PK_AQA0014_SYN_RPT_COUNT																																							
--------------------------------------------------------																																							
																																							
CREATE UNIQUE INDEX "MS9ABA"."PK_AQA0014_SYN_RPT_COUNT" ON "MS9ABA"."AQA0014_SYNDICATION_RPT_COUNT" ("AQA0014_DATE", "AQA0014_COUNT")																																							
PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 32768 NEXT 32768 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Index PK_AQA0015_COPY_SYND_SEC_MAST																																							
--------------------------------------------------------																																							
																																							
CREATE UNIQUE INDEX "MS9ABA"."PK_AQA0015_COPY_SYND_SEC_MAST" ON "MS9ABA"."AQA0015_COPY_SYND_SEC_MAST_IND" ("AQA0015_DATA_DATE")																																							
PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 32768 NEXT 32768 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Index PK_AQA0016_SYNDICATED_SEC_MAST																																							
--------------------------------------------------------																																							
																																							
CREATE UNIQUE INDEX "MS9ABA"."PK_AQA0016_SYNDICATED_SEC_MAST" ON "MS9ABA"."AQA0016_SYNDICATED_SEC_MAST_DT" ("AQA0016_SECURITY_CODE", "AQA0016_ISSUE_NO")																																							
PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 32768 NEXT 32768 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Index PK_AQA0017_AUCTION_DATE																																							
--------------------------------------------------------																																							
																																							
CREATE UNIQUE INDEX "MS9ABA"."PK_AQA0017_AUCTION_DATE" ON "MS9ABA"."AQA0017_AUCTION_IND" ("AQA0017_AUCTION_DATE")																																							
PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 32768 NEXT 32768 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Index PK_AQA0019_AUCTION_REPORT_IND																																							
--------------------------------------------------------																																							
																																							
CREATE UNIQUE INDEX "MS9ABA"."PK_AQA0019_AUCTION_REPORT_IND" ON "MS9ABA"."AQA0019_AUCTION_REPORT_IND" ("AQA0019_REPORT_NAME", "AQA0019_REPORT_RUN_DATE")																																							
PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Index PK_AQA0020_AUCTION_RESULTS_REPORT																																							
--------------------------------------------------------																																							
																																							
CREATE UNIQUE INDEX "MS9ABA"."PK_AQA0020_AUCTION_RESULTS_REPORT" ON "MS9ABA"."AQA0020_AUCTION_RESULTS_REPORT" ("AQA0020_SECURITY_CODE", "AQA0020_ISSUE_NO", "AQA0020_FORM_NO")																																							
PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Index PK_AQA0021_AUCTION_RESULTS_REPORT_CTG_STG																																							
--------------------------------------------------------																																							
																																							
CREATE UNIQUE INDEX "MS9ABA"."PK_AQA0021_AUCTION_RESULTS_REPORT_CTG_STG" ON "MS9ABA"."AQA0021_AUCTION_RESULTS_REPORT_CTG_STG" ("AQA0021_SECURITY_CODE", "AQA0021_ISSUE_NO", "AQA0021_FORM_NO")																																							
PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Index PK_AQA0101_REPO_TRANS																																							
--------------------------------------------------------																																							
																																							
CREATE UNIQUE INDEX "MS9ABA"."PK_AQA0101_REPO_TRANS" ON "MS9ABA"."AQA0101_REPO_TRANS" ("AQA0101_BANK_CODE", "AQA0101_SEQ_NO", "AQA0101_TRANS_REF_NO", "AQA0101_RECEIVED_DT")																																							
PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 1048576 NEXT 32768 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Index PK_AQA0102_USER																																							
--------------------------------------------------------																																							
																																							
CREATE UNIQUE INDEX "MS9ABA"."PK_AQA0102_USER" ON "MS9ABA"."AQA0102_USER" ("AQA0102_USER_ID")																																							
PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 1048576 NEXT 32768 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Index PK_AQA0103_PRIVATE_KEY																																							
--------------------------------------------------------																																							
																																							
CREATE UNIQUE INDEX "MS9ABA"."PK_AQA0103_PRIVATE_KEY" ON "MS9ABA"."AQA0103_PRIVATE_KEY" ("AQA0103_PRIVATE_KEY")																																							
PCTFREE 10 INITRANS 2 MAXTRANS 167 COMPUTE STATISTICS																																							
STORAGE(INITIAL 1048576 NEXT 32768 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Index PK_AQA0107_ERF_LOG																																							
--------------------------------------------------------																																							
																																							
CREATE UNIQUE INDEX "MS9ABA"."PK_AQA0107_ERF_LOG" ON "MS9ABA"."AQA0107_ERF_AUDIT_LOG" ("AQA0107_LOG_CD", "AQA0107_UPDATED_DT")																																							
PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 1048576 NEXT 32768 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Index PK_AQA0107_LOG																																							
--------------------------------------------------------																																							
																																							
CREATE UNIQUE INDEX "MS9ABA"."PK_AQA0107_LOG" ON "MS9ABA"."AQA0107_AUDIT_LOG" ("AQA0107_LOG_CD", "AQA0107_UPDATED_DT")																																							
PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 1048576 NEXT 32768 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Index PK_AQA0108_ERF_LOG_DETAIL																																							
--------------------------------------------------------																																							
																																							
CREATE UNIQUE INDEX "MS9ABA"."PK_AQA0108_ERF_LOG_DETAIL" ON "MS9ABA"."AQA0108_ERF_LOG_DETAIL" ("AQA0108_LOG_CD")																																							
PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 1048576 NEXT 32768 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Index PK_AQA0108_LOG_DETAIL																																							
--------------------------------------------------------																																							
																																							
CREATE UNIQUE INDEX "MS9ABA"."PK_AQA0108_LOG_DETAIL" ON "MS9ABA"."AQA0108_LOG_DETAIL" ("AQA0108_LOG_CD")																																							
PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 1048576 NEXT 32768 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Index PK_AQA0111_CANCEL_TRADE																																							
--------------------------------------------------------																																							
																																							
CREATE UNIQUE INDEX "MS9ABA"."PK_AQA0111_CANCEL_TRADE" ON "MS9ABA"."AQA0111_CANCEL_TRADE" ("AQA0111_SECURITY_CODE", "AQA0111_BANK_CODE", "AQA0111_SEQ_NO", "AQA0111_TRANS_REF_NO")																																							
PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 1048576 NEXT 32768 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Index PK_AQA0112_DUR_RATE																																							
--------------------------------------------------------																																							
																																							
CREATE UNIQUE INDEX "MS9ABA"."PK_AQA0112_DUR_RATE" ON "MS9ABA"."AQA0112_DUR_RATE" ("AQA0112_REF_NO", "AQA0112_DATE_CHANGE")																																							
PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 3145728 NEXT 32768 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Index ABA0235_PK_INDEX																																							
--------------------------------------------------------																																							
																																							
CREATE UNIQUE INDEX "MS9ABA"."ABA0235_PK_INDEX" ON "MS9ABA"."ABA0235_SB_SUBMISSION_SUMMARY" ("ABA0235_SB_SUBMISSION_SUM_ID")																																							
PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Index ABA0236_PK_INDEX																																							
--------------------------------------------------------																																							
																																							
CREATE UNIQUE INDEX "MS9ABA"."ABA0236_PK_INDEX" ON "MS9ABA"."ABA0236_SB_HLD_INFO_DT_ERR" ("ABA0236_SB_HLD_INFO_DT_ERR_ID")																																							
PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Index ABA0237_PK_INDEX																																							
--------------------------------------------------------																																							
																																							
CREATE UNIQUE INDEX "MS9ABA"."ABA0237_PK_INDEX" ON "MS9ABA"."ABA0237_SB_USER" ("ABA0237_SB_USER_ID")																																							
PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Index ABA0238_PK_INDEX																																							
--------------------------------------------------------																																							
																																							
CREATE UNIQUE INDEX "MS9ABA"."ABA0238_PK_INDEX" ON "MS9ABA"."ABA0238_SB_LEVEL_ACTION" ("ABA0238_SB_LEVEL", "ABA0238_SB_MODULE")																																							
PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Index ABA0239_PK_INDEX																																							
--------------------------------------------------------																																							
																																							
CREATE UNIQUE INDEX "MS9ABA"."ABA0239_PK_INDEX" ON "MS9ABA"."ABA0239_SB_ACTION_REF" ("ABA0239_SB_MODULE")																																							
PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Index ABA0240_PK_INDEX																																							
--------------------------------------------------------																																							
																																							
CREATE UNIQUE INDEX "MS9ABA"."ABA0240_PK_INDEX" ON "MS9ABA"."ABA0240_SB_CD_SUBMISSION_TYPE" ("ABA0240_SB_CD_SUBMIT_TYPE")																																							
PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Index ABA0241_PK_INDEX																																							
--------------------------------------------------------																																							
																																							
CREATE UNIQUE INDEX "MS9ABA"."ABA0241_PK_INDEX" ON "MS9ABA"."ABA0241_SB_RESULT_FILE" ("ABA0241_SB_RESULT_FILE_ID")																																							
PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Index ABA0250_PK_INDEX																																							
--------------------------------------------------------																																							
																																							
CREATE UNIQUE INDEX "MS9ABA"."ABA0250_PK_INDEX" ON "MS9ABA"."ABA0250_SB_AUDIT_LOG" ("ABA0250_SB_AUDIT_ID")																																							
PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Index ABA0251_PK_INDEX																																							
--------------------------------------------------------																																							
																																							
CREATE UNIQUE INDEX "MS9ABA"."ABA0251_PK_INDEX" ON "MS9ABA"."ABA0251_SB_CONT_MAKE_CHECK" ("ABA0251_ID")																																							
PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Index ABA0252_PK_INDEX																																							
--------------------------------------------------------																																							
																																							
CREATE UNIQUE INDEX "MS9ABA"."ABA0252_PK_INDEX" ON "MS9ABA"."ABA0252_SB_SYSCONF_MAKE_CHECK" ("ABA0252_SB_ID")																																							
PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Index ABA0280_PK_INDEX																																							
--------------------------------------------------------																																							
																																							
CREATE UNIQUE INDEX "MS9ABA"."ABA0280_PK_INDEX" ON "MS9ABA"."ABA0280_SB_TEMP_APP_SUB_DT" ("ABA0280_SB_IC_PASSPORT") ;																																							
--------------------------------------------------------																																							
--  DDL for Index ABA0281_PK_INDEX																																							
--------------------------------------------------------																																							
																																							
CREATE UNIQUE INDEX "MS9ABA"."ABA0281_PK_INDEX" ON "MS9ABA"."ABA0281_SB_TEMP_HOLDING" ("ABA0281_SB_IC_PASSPORT") ;																																							
--------------------------------------------------------																																							
--  DDL for Index ABA0283_COUPON_PK_INDEX																																							
--------------------------------------------------------																																							
																																							
CREATE UNIQUE INDEX "MS9ABA"."ABA0283_COUPON_PK_INDEX" ON "MS9ABA"."ABA0283_SB_COUPON_RESULT_FILE" ("ABA0283_COUPON_ID")																																							
PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Index BATCH_JOB_EXECUTION_PK_INDEX																																							
--------------------------------------------------------																																							
																																							
CREATE UNIQUE INDEX "MS9ABA"."BATCH_JOB_EXECUTION_PK_INDEX" ON "MS9ABA"."BATCH_JOB_EXECUTION" ("JOB_EXECUTION_ID")																																							
PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Index BATCH_JOB_INSTANCE_PK_INDEX																																							
--------------------------------------------------------																																							
																																							
CREATE UNIQUE INDEX "MS9ABA"."BATCH_JOB_INSTANCE_PK_INDEX" ON "MS9ABA"."BATCH_JOB_INSTANCE" ("JOB_INSTANCE_ID")																																							
PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Index ABA0230_INDEX_BATCH_JOB_ID																																							
--------------------------------------------------------																																							
																																							
CREATE INDEX "MS9ABA"."ABA0230_INDEX_BATCH_JOB_ID" ON "MS9ABA"."ABA0230_SB_HLD_INFO" ("ABA0230_SB_BATCH_JOB_ID")																																							
PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Index ABA0224_INDEX_BATCH_JOB_ID																																							
--------------------------------------------------------																																							
																																							
CREATE INDEX "MS9ABA"."ABA0224_INDEX_BATCH_JOB_ID" ON "MS9ABA"."ABA0224_SB_SUBSCRIPT" ("ABA0224_SB_BATCH_JOB_ID")																																							
PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Index ABA0224_INDEX_SECURITY_CODE																																							
--------------------------------------------------------																																							
																																							
CREATE INDEX "MS9ABA"."ABA0224_INDEX_SECURITY_CODE" ON "MS9ABA"."ABA0224_SB_SUBSCRIPT" ("ABA0224_SB_SECURITY_CODE")																																							
PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Index ABA0223_INDEX_IC_PASSPORT																																							
--------------------------------------------------------																																							
																																							
CREATE INDEX "MS9ABA"."ABA0223_INDEX_IC_PASSPORT" ON "MS9ABA"."ABA0223_SB_APPLICANT" ("ABA0223_SB_IC_PASSPORT")																																							
PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 38797312 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Index ABA0231_INDEX_HLD_INFO_ID																																							
--------------------------------------------------------																																							
																																							
CREATE INDEX "MS9ABA"."ABA0231_INDEX_HLD_INFO_ID" ON "MS9ABA"."ABA0231_SB_HLD_INFO_DT" ("ABA0231_SB_HLD_INFO_ID")																																							
PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 7340032 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Index ABA0232_INDEX_BATCH_JOB_ID																																							
--------------------------------------------------------																																							
																																							
CREATE INDEX "MS9ABA"."ABA0232_INDEX_BATCH_JOB_ID" ON "MS9ABA"."ABA0232_SB_ALLOTMENT_RESULT" ("ABA0232_SB_BATCH_JOB_ID")																																							
PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 23068672 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Index ABA0231_INDEX_APPLICANT_ID																																							
--------------------------------------------------------																																							
																																							
CREATE INDEX "MS9ABA"."ABA0231_INDEX_APPLICANT_ID" ON "MS9ABA"."ABA0231_SB_HLD_INFO_DT" ("ABA0231_SB_APPLICANT_ID")																																							
PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 8388608 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Index ABA0231_INDEX_SECURITY_CODE																																							
--------------------------------------------------------																																							
																																							
CREATE INDEX "MS9ABA"."ABA0231_INDEX_SECURITY_CODE" ON "MS9ABA"."ABA0231_SB_HLD_INFO_DT" ("ABA0231_SB_SECURITY_CODE")																																							
PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 9437184 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Index ABA0225_INDEX_APPLICANT_ID																																							
--------------------------------------------------------																																							
																																							
CREATE INDEX "MS9ABA"."ABA0225_INDEX_APPLICANT_ID" ON "MS9ABA"."ABA0225_SB_SUBSCRIPT_DT" ("ABA0225_SB_APPLICANT_ID")																																							
PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 33554432 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Index ABA0232_INDEX_SUB_DETAIL_ID																																							
--------------------------------------------------------																																							
																																							
CREATE INDEX "MS9ABA"."ABA0232_INDEX_SUB_DETAIL_ID" ON "MS9ABA"."ABA0232_SB_ALLOTMENT_RESULT" ("ABA0232_SB_SUB_DETAIL_ID")																																							
PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 24117248 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Index I_MLOG$_ABA0225_SB_SUBSCRI																																							
--------------------------------------------------------																																							
																																							
CREATE INDEX "MS9ABA"."I_MLOG$_ABA0225_SB_SUBSCRI" ON "MS9ABA"."MLOG$_ABA0225_SB_SUBSCRIPT" ("XID$$")																																							
PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 230686720 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Index ABA0225_INDEX_SUB_ID																																							
--------------------------------------------------------																																							
																																							
CREATE INDEX "MS9ABA"."ABA0225_INDEX_SUB_ID" ON "MS9ABA"."ABA0225_SB_SUBSCRIPT_DT" ("ABA0225_SB_SUB_ID")																																							
PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 32505856 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Index ABA0280_INDEX_SECURITY_CODE																																							
--------------------------------------------------------																																							
																																							
CREATE INDEX "MS9ABA"."ABA0280_INDEX_SECURITY_CODE" ON "MS9ABA"."ABA0280_SB_TEMP_APP_SUB_DT" ("ABA0280_SB_SECURITY_CODE") ;																																							
--------------------------------------------------------																																							
--  DDL for Index I_MLOG$_ABA0223_SB_APPLICA																																							
--------------------------------------------------------																																							
																																							
CREATE INDEX "MS9ABA"."I_MLOG$_ABA0223_SB_APPLICA" ON "MS9ABA"."MLOG$_ABA0223_SB_APPLICANT" ("XID$$")																																							
PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 37748736 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP" ;																																							
CREATE MATERIALIZED VIEW LOG ON "MS9ABA"."ABA0223_SB_APPLICANT"																																							
PCTFREE 10 PCTUSED 30 INITRANS 1 MAXTRANS 255 LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP"																																							
WITH ROWID EXCLUDING NEW VALUES;																																							
CREATE MATERIALIZED VIEW LOG ON "MS9ABA"."ABA0225_SB_SUBSCRIPT_DT"																																							
PCTFREE 10 PCTUSED 30 INITRANS 1 MAXTRANS 255 LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP"																																							
WITH ROWID EXCLUDING NEW VALUES;																																							
--------------------------------------------------------																																							
--  DDL for Procedure ABA0017_REFRESH																																							
--------------------------------------------------------																																							
set define off;																																							
																																							
CREATE OR REPLACE EDITIONABLE PROCEDURE "MS9ABA"."ABA0017_REFRESH" AS																																							
v_cur integer;																																							
v_result integer;																																							
BEGIN																																							
v_cur := DBMS_SQL.OPEN_CURSOR;																																							
--   DBMS_SQL.PARSE(v_cur,'ms9gsw.aba0017_refresh@tcma',DBMS_SQL.NATIVE);																																							
DBMS_SQL.PARSE(v_cur,'select count(*) from all_tables@tcma',DBMS_SQL.NATIVE);																																							
v_result := DBMS_SQL.EXECUTE(v_cur);																																							
DBMS_SQL.CLOSE_CURSOR(v_cur);																																							
commit;																																							
END;																																							
																																							
																																							
/																																							
--------------------------------------------------------																																							
--  DDL for Procedure ABA0018_REFRESH																																							
--------------------------------------------------------																																							
set define off;																																							
																																							
CREATE OR REPLACE EDITIONABLE PROCEDURE "MS9ABA"."ABA0018_REFRESH" AS																																							
v_cur integer;																																							
v_result integer;																																							
BEGIN																																							
v_cur := DBMS_SQL.OPEN_CURSOR;																																							
--   DBMS_SQL.PARSE(v_cur,'execute call ms9gsw.aba0018_refresh@tcma',DBMS_SQL.NATIVE);																																							
DBMS_SQL.PARSE(v_cur,'select count(*) from all_tables@tcma',DBMS_SQL.NATIVE);																																							
v_result := DBMS_SQL.EXECUTE(v_cur);																																							
DBMS_SQL.CLOSE_CURSOR(v_cur);																																							
commit;																																							
END;																																							
																																							
																																							
/																																							
--------------------------------------------------------																																							
--  DDL for Procedure ABA0019_REFRESH																																							
--------------------------------------------------------																																							
set define off;																																							
																																							
CREATE OR REPLACE EDITIONABLE PROCEDURE "MS9ABA"."ABA0019_REFRESH" AS																																							
BEGIN																																							
																																							
execute ms9gsw.aba0019_refresh@tcma;																																							
																																							
END;																																							
																																							
																																							
/																																							
--------------------------------------------------------																																							
--  DDL for Procedure ERF_MIGRATE_USERS																																							
--------------------------------------------------------																																							
set define off;																																							
																																							
CREATE OR REPLACE EDITIONABLE PROCEDURE "MS9ABA"."ERF_MIGRATE_USERS"																																							
AS																																							
BEGIN																																							
FOR REC_USER IN (SELECT * FROM MS9ABA.AQA0102_USER)																																							
LOOP																																							
INSERT INTO MS9ABA.AQA0102_ERF_USER VALUES (REC_USER.AQA0102_USER_ID,REC_USER.AQA0102_LEVEL,REC_USER.AQA0102_USER_LAST_LOGIN,REC_USER.AQA0102_USER_LVL_CHANGE);																																							
END LOOP;																																							
COMMIT;																																							
END ERF_MIGRATE_USERS;																																							
																																							
																																							
/																																							
--------------------------------------------------------																																							
--  DDL for Procedure ERF_UPDATE_DUR_RATES																																							
--------------------------------------------------------																																							
set define off;																																							
																																							
CREATE OR REPLACE EDITIONABLE PROCEDURE "MS9ABA"."ERF_UPDATE_DUR_RATES"																																							
(V_REF_NO IN AQA0112_DUR_RATE.AQA0112_REF_NO%TYPE,																																							
V_LOW_DUR IN AQA0112_DUR_RATE.AQA0112_LOW_DURATION%TYPE,																																							
V_HIGH_DUR IN AQA0112_DUR_RATE.AQA0112_HIGH_DURATION%TYPE,																																							
V_REPO_RATE IN AQA0112_DUR_RATE.AQA0112_REPO_RATE%TYPE)																																							
IS																																							
v_cnt NUMBER;																																							
BEGIN																																							
	select count(*) into v_cnt from ms9aba.AQA0112_DUR_RATE where to_char(AQA0112_DATE_CHANGE,'ddmmyyyy') = to_char(sysdate,'ddmmyyyy') AND AQA0112_REF_NO = V_REF_NO;																																						
	if v_cnt > 0																																						
	then																																						
		UPDATE MS9ABA.AQA0112_DUR_RATE SET AQA0112_REF_NO=V_REF_NO, AQA0112_LOW_DURATION=V_LOW_DUR, AQA0112_HIGH_DURATION=V_HIGH_DUR, AQA0112_REPO_RATE=V_REPO_RATE																																					
		WHERE to_char(AQA0112_DATE_CHANGE,'ddmmyyyy') = to_char(sysdate,'ddmmyyyy') AND AQA0112_REF_NO = V_REF_NO;																																					
	else																																						
		INSERT INTO MS9ABA.AQA0112_DUR_RATE (AQA0112_REF_NO, AQA0112_LOW_DURATION, AQA0112_HIGH_DURATION, AQA0112_REPO_RATE, AQA0112_DATE_CHANGE) VALUES																																					
		(V_REF_NO, V_LOW_DUR, V_HIGH_DUR, V_REPO_RATE, sysdate);																																					
	end if;																																						
	DBMS_OUTPUT.PUT_LINE(v_cnt);																																						
END ERF_UPDATE_DUR_RATES;																																							
																																							
																																							
																																							
/																																							
--------------------------------------------------------																																							
--  DDL for Procedure TEST																																							
--------------------------------------------------------																																							
set define off;																																							
																																							
CREATE OR REPLACE EDITIONABLE PROCEDURE "MS9ABA"."TEST" is																																							
cursor c_test is																																							
select aba0001_security_code, aba0001_issue_no from ms9aba.aqa0001_security_master;																																							
secCode aqa0001_security_master.ABA0001_SECURITY_CODE%TYPE;																																							
issueNo aqa0001_security_master.ABA0001_ISSUE_NO%TYPE;																																							
BEGIN																																							
	open c_test;																																						
	loop																																						
		fetch c_test into seccode,issueNo;																																					
		exit when c_test%NOTFOUND;																																					
	end loop;																																						
	close c_test;																																						
end test;																																							
																																							
																																							
/																																							
--------------------------------------------------------																																							
--  DDL for Procedure UPDATEABA0017																																							
--------------------------------------------------------																																							
set define off;																																							
																																							
CREATE OR REPLACE EDITIONABLE PROCEDURE "MS9ABA"."UPDATEABA0017"																																							
IS																																							
BEGIN																																							
delete from ms9gsw.aba0017_final_daily_price@tcma;																																							
insert into ms9gsw.aba0017_final_daily_price@tcma select * from ms9aba.aba0017_final_daily_price;																																							
commit;																																							
alter session close database link tcma;																																							
delete from ms9gsw.aba0017_final_daily_price@tcmb;																																							
insert into ms9gsw.aba0017_final_daily_price@tcmb select * from ms9aba.aba0017_final_daily_price;																																							
commit;																																							
alter session close database link tcmb;																																							
END;																																							
																																							
																																							
																																							
/																																							
--------------------------------------------------------																																							
--  DDL for Function MLAPERIODPRICE																																							
--------------------------------------------------------																																							
																																							
CREATE OR REPLACE EDITIONABLE FUNCTION "MS9ABA"."MLAPERIODPRICE" (issueCode IN ABA0001_SECURITY_MASTER.ABA0001_SECURITY_CODE%TYPE, periodDate IN ABA0017_FINAL_DAILY_PRICE.ABA0017_SUBMISSION_DATE%TYPE) RETURN ABA0017_FINAL_DAILY_PRICE.ABA0017_MLA_PRICE%TYPE IS price NUMBER(7,4); BEGIN SELECT	NVL(ABA0017_MLA_PRICE, 0) INTO price FROM	ABA0017_FINAL_DAILY_PRICE WHERE	ABA0017_SECURITY_CODE = issueCode	AND ABA0017_SUBMISSION_DATE = ( SELECT MAX(ABA0017_SUBMISSION_DATE)					FROM ABA0017_FINAL_DAILY_PRICE					WHERE ABA0017_SUBMISSION_DATE < (periodDate - 14)					AND ABA0017_SUBMISSION_DATE >= (periodDate - 21)					AND TO_CHAR(ABA0017_SUBMISSION_DATE, 'D') NOT IN (1, 7)					AND ABA0017_SUBMISSION_DATE NOT IN (SELECT ABA0019_DATE					FROM ABA0019_PUBLIC_HOLIDAY					WHERE ABA0019_COUNTRY = 'SG')); RETURN price; End;
																																							
																																							
/																																							
--------------------------------------------------------																																							
--  DDL for Synonymn ABA0019_PUBLIC_HOLIDAY																																							
--------------------------------------------------------																																							
																																							
CREATE OR REPLACE EDITIONABLE SYNONYM "MS9ABA"."ABA0019_PUBLIC_HOLIDAY" FOR "MS9ABA"."ABA0019_PUBLIC_HOLIDAY"@"MNET";																																							
--------------------------------------------------------																																							
--  DDL for Synonymn ABA0101_SB_SECURITY_MASTER																																							
--------------------------------------------------------																																							
																																							
CREATE OR REPLACE EDITIONABLE SYNONYM "MS9ABA"."ABA0101_SB_SECURITY_MASTER" FOR "MS9ABA"."ABA0101_SB_SECURITY_MASTER"@"MNET";																																							
--------------------------------------------------------																																							
--  DDL for Synonymn ABA0124_SB_COUPON_RATE_DETAILS																																							
--------------------------------------------------------																																							
																																							
CREATE OR REPLACE EDITIONABLE SYNONYM "MS9ABA"."ABA0124_SB_COUPON_RATE_DETAILS" FOR "MS9ABA"."ABA0124_SB_COUPON_RATE_DETAILS"@"MNET";																																							
--------------------------------------------------------																																							
--  DDL for Synonymn ABA0126_SB_REDEMPTION_RESULT																																							
--------------------------------------------------------																																							
																																							
CREATE OR REPLACE EDITIONABLE SYNONYM "MS9ABA"."ABA0126_SB_REDEMPTION_RESULT" FOR "MS9ABA"."ABA0126_SB_REDEMPTION_RESULT"@"MNET";																																							
--------------------------------------------------------																																							
--  DDL for Synonymn ABA0127_SB_SYSTEM_CONFIG																																							
--------------------------------------------------------																																							
																																							
CREATE OR REPLACE EDITIONABLE SYNONYM "MS9ABA"."ABA0127_SB_SYSTEM_CONFIG" FOR "MS9ABA"."ABA0127_SB_SYSTEM_CONFIG"@"MNET";																																							
--------------------------------------------------------																																							
--  DDL for Synonymn ABA0223_SB_PGP_CONFIG																																							
--------------------------------------------------------																																							
																																							
CREATE OR REPLACE EDITIONABLE SYNONYM "MS9ABA"."ABA0223_SB_PGP_CONFIG" FOR "MS9ABA"."ABA0223_SB_PGP_CONFIG"@"MNET";																																							
--------------------------------------------------------																																							
--  Constraints for Table ABA0009_EAUCTION_CONFIG_TMP																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0009_EAUCTION_CONFIG_TMP" ADD CONSTRAINT "PK_ABA0009_EAUCTION_CONFIG_TMP" PRIMARY KEY ("ABA0009_KEY")																																							
USING INDEX PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 65536 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP"  ENABLE;																																							
ALTER TABLE "MS9ABA"."ABA0009_EAUCTION_CONFIG_TMP" MODIFY ("ABA0009_KEY" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0009_EAUCTION_CONFIG_TMP" MODIFY ("ABA0009_VALUE" NOT NULL ENABLE);																																							
--------------------------------------------------------																																							
--  Constraints for Table ABA0218_SB_CD_NATION_CTY																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0218_SB_CD_NATION_CTY" ADD CONSTRAINT "ABA0218_SB_CD_NATION_CTY_PK" PRIMARY KEY ("ABA0218_SB_CD_NATION_CTY")																																							
USING INDEX "MS9ABA"."ABA0218_PK_INDEX"  ENABLE;																																							
ALTER TABLE "MS9ABA"."ABA0218_SB_CD_NATION_CTY" MODIFY ("ABA0218_SB_CD_NATION_CTY" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0218_SB_CD_NATION_CTY" MODIFY ("ABA0218_SB_DESCRIPTION" NOT NULL ENABLE);																																							
--------------------------------------------------------																																							
--  Constraints for Table ABA0221_SB_CD_BATCHJOB_STATUS																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0221_SB_CD_BATCHJOB_STATUS" ADD CONSTRAINT "ABA0221_PK" PRIMARY KEY ("ABA0221_SB_CD_BATCHJOB_STATUS")																																							
USING INDEX "MS9ABA"."ABA0221_PK_INDEX"  ENABLE;																																							
ALTER TABLE "MS9ABA"."ABA0221_SB_CD_BATCHJOB_STATUS" MODIFY ("ABA0221_SB_CD_BATCHJOB_STATUS" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0221_SB_CD_BATCHJOB_STATUS" MODIFY ("ABA0221_SB_DESCRIPTION" NOT NULL ENABLE);																																							
--------------------------------------------------------																																							
--  Constraints for Table ABA0235_SB_SUBMISSION_SUMMARY																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0235_SB_SUBMISSION_SUMMARY" ADD CONSTRAINT "ABA0235_PK" PRIMARY KEY ("ABA0235_SB_SUBMISSION_SUM_ID")																																							
USING INDEX "MS9ABA"."ABA0235_PK_INDEX"  ENABLE;																																							
ALTER TABLE "MS9ABA"."ABA0235_SB_SUBMISSION_SUMMARY" MODIFY ("ABA0235_SB_SUBMISSION_SUM_ID" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0235_SB_SUBMISSION_SUMMARY" MODIFY ("ABA0235_SB_JOB_ID" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0235_SB_SUBMISSION_SUMMARY" MODIFY ("ABA0235_SB_ORG_ID" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0235_SB_SUBMISSION_SUMMARY" MODIFY ("ABA0235_SB_SECURITY_CODE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0235_SB_SUBMISSION_SUMMARY" MODIFY ("ABA0235_SB_QTY_REJECTED" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0235_SB_SUBMISSION_SUMMARY" MODIFY ("ABA0235_SB_QTY_SUBMITTED" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0235_SB_SUBMISSION_SUMMARY" MODIFY ("ABA0235_SB_QTY_SUCCESS" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0235_SB_SUBMISSION_SUMMARY" MODIFY ("ABA0235_SB_TOTAL_AMT_SUBMIT" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0235_SB_SUBMISSION_SUMMARY" MODIFY ("ABA0235_SB_TOTAL_AMT_SUCCESS" NOT NULL ENABLE);																																							
--------------------------------------------------------																																							
--  Constraints for Table TMP_CALL_CENTRE																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."TMP_CALL_CENTRE" MODIFY ("TMP_CALL_CTR_DTL" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."TMP_CALL_CENTRE" MODIFY ("TMP_CALL_CTR_DT" NOT NULL ENABLE);																																							
--------------------------------------------------------																																							
--  Constraints for Table ABA0229_SB_REDEMPTION_DT_ERR																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0229_SB_REDEMPTION_DT_ERR" ADD CONSTRAINT "ABA0229_PK" PRIMARY KEY ("ABA0229_SB_REDEM_DT_ERR_ID")																																							
USING INDEX "MS9ABA"."ABA0229_PK_INDEX"  ENABLE;																																							
ALTER TABLE "MS9ABA"."ABA0229_SB_REDEMPTION_DT_ERR" MODIFY ("ABA0229_SB_REDEM_DT_ERR_ID" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0229_SB_REDEMPTION_DT_ERR" MODIFY ("ABA0229_SB_REDEM_ID" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0229_SB_REDEMPTION_DT_ERR" MODIFY ("ABA0229_SB_LINE_NUMBER" NOT NULL ENABLE);																																							
--------------------------------------------------------																																							
--  Constraints for Table ABA0252_SB_SYSCONF_MAKE_CHECK																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0252_SB_SYSCONF_MAKE_CHECK" ADD CONSTRAINT "ABA0252_PK" PRIMARY KEY ("ABA0252_SB_ID")																																							
USING INDEX "MS9ABA"."ABA0252_PK_INDEX"  ENABLE;																																							
ALTER TABLE "MS9ABA"."ABA0252_SB_SYSCONF_MAKE_CHECK" MODIFY ("ABA0252_SB_ID" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0252_SB_SYSCONF_MAKE_CHECK" MODIFY ("ABA0252_SB_APPROVER" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0252_SB_SYSCONF_MAKE_CHECK" MODIFY ("ABA0252_SB_CURRENT_VALUE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0252_SB_SYSCONF_MAKE_CHECK" MODIFY ("ABA0252_SB_LIMIT" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0252_SB_SYSCONF_MAKE_CHECK" MODIFY ("ABA0252_SB_IDENTIFIER" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0252_SB_SYSCONF_MAKE_CHECK" MODIFY ("ABA0252_SB_NEW_VALUE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0252_SB_SYSCONF_MAKE_CHECK" MODIFY ("ABA0252_SB_REQUESTER" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0252_SB_SYSCONF_MAKE_CHECK" MODIFY ("ABA0252_SB_TYPE" NOT NULL ENABLE);																																							
--------------------------------------------------------																																							
--  Constraints for Table ABA0232_SB_ALLOTMENT_RESULT																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0232_SB_ALLOTMENT_RESULT" ADD CONSTRAINT "ABA0232_SB_ALLOTMENT_RESULT_PK" PRIMARY KEY ("ABA0232_SB_ALLOT_RESULT_ID")																																							
USING INDEX "MS9ABA"."ABA0232_PK_INDEX"  ENABLE;																																							
ALTER TABLE "MS9ABA"."ABA0232_SB_ALLOTMENT_RESULT" MODIFY ("ABA0232_SB_ALLOT_RESULT_ID" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0232_SB_ALLOTMENT_RESULT" MODIFY ("ABA0232_SB_BATCH_JOB_ID" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0232_SB_ALLOTMENT_RESULT" MODIFY ("ABA0232_SB_SUB_DETAIL_ID" NOT NULL ENABLE);																																							
--------------------------------------------------------																																							
--  Constraints for Table ABA0241_SB_RESULT_FILE																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0241_SB_RESULT_FILE" ADD CONSTRAINT "ABA0241_SB_RESULT_FILE_PK" PRIMARY KEY ("ABA0241_SB_RESULT_FILE_ID")																																							
USING INDEX "MS9ABA"."ABA0241_PK_INDEX"  ENABLE;																																							
ALTER TABLE "MS9ABA"."ABA0241_SB_RESULT_FILE" MODIFY ("ABA0241_SB_RESULT_FILE_ID" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0241_SB_RESULT_FILE" MODIFY ("ABA0241_SB_JOB_TYPE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0241_SB_RESULT_FILE" MODIFY ("ABA0241_SB_FILE_NAME" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0241_SB_RESULT_FILE" MODIFY ("ABA0241_SB_FILE_PATH" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0241_SB_RESULT_FILE" MODIFY ("ABA0241_SB_REFERENCE_NAME" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0241_SB_RESULT_FILE" MODIFY ("ABA0241_SB_REFERENCE_NUMBER" NOT NULL ENABLE);																																							
--------------------------------------------------------																																							
--  Constraints for Table ABA0283_SB_COUPON_RESULT_FILE																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0283_SB_COUPON_RESULT_FILE" ADD CONSTRAINT "ABA0283_COUPON_PK_INDEX" PRIMARY KEY ("ABA0283_COUPON_ID")																																							
USING INDEX "MS9ABA"."ABA0283_COUPON_PK_INDEX"  ENABLE;																																							
ALTER TABLE "MS9ABA"."ABA0283_SB_COUPON_RESULT_FILE" MODIFY ("ABA0283_MATURITY_DATE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0283_SB_COUPON_RESULT_FILE" MODIFY ("ABA0283_CPN_RATE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0283_SB_COUPON_RESULT_FILE" MODIFY ("ABA0283_NEXT_CPN_DATE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0283_SB_COUPON_RESULT_FILE" MODIFY ("ABA0283_REDEMPTION_RATE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0283_SB_COUPON_RESULT_FILE" MODIFY ("ABA0283_CPN_PAYMENT_DATE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0283_SB_COUPON_RESULT_FILE" MODIFY ("ABA0283_REDEMPTION_DATE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0283_SB_COUPON_RESULT_FILE" MODIFY ("ABA0283_PROCESSING_DATE" NOT NULL ENABLE);																																							
--------------------------------------------------------																																							
--  Constraints for Table ABA0001_SECURITY_MASTER_20230515																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0001_SECURITY_MASTER_20230515" MODIFY ("ABA0001_SECURITY_NAME" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0001_SECURITY_MASTER_20230515" MODIFY ("ABA0001_ISSUE_DATE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0001_SECURITY_MASTER_20230515" MODIFY ("ABA0001_TENDER_DATE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0001_SECURITY_MASTER_20230515" MODIFY ("ABA0001_ISSUE_SIZE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0001_SECURITY_MASTER_20230515" MODIFY ("ABA0001_MATURITY_DATE" NOT NULL ENABLE);																																							
--------------------------------------------------------																																							
--  Constraints for Table ABA0223_SB_APPLICANT																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0223_SB_APPLICANT" ADD CONSTRAINT "UK_P3N9Y6IE1MYL1GN8MJITY9F0X" UNIQUE ("ABA0223_SB_IC_PASSPORT", "ABA0223_SB_NAME_OF_APPLN", "ABA0223_SB_CD_NATION", "ABA0223_SB_CD_NATION_CTY")																																							
USING INDEX "MS9ABA"."UK_P3N9Y6IE1MYL1GN8MJITY9F0X"  ENABLE;																																							
ALTER TABLE "MS9ABA"."ABA0223_SB_APPLICANT" ADD CONSTRAINT "ABA0223_SB_APPLICANT_PK" PRIMARY KEY ("ABA0223_SB_APPLICANT_ID")																																							
USING INDEX "MS9ABA"."ABA0223_PK_INDEX"  ENABLE;																																							
ALTER TABLE "MS9ABA"."ABA0223_SB_APPLICANT" MODIFY ("ABA0223_SB_APPLICANT_ID" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0223_SB_APPLICANT" MODIFY ("ABA0223_SB_IC_PASSPORT" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0223_SB_APPLICANT" MODIFY ("ABA0223_SB_CD_NATION" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0223_SB_APPLICANT" MODIFY ("ABA0223_SB_CD_NATION_CTY" NOT NULL ENABLE);																																							
--------------------------------------------------------																																							
--  Constraints for Table ABA0225_SB_SUBSCRIPT_DT																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0225_SB_SUBSCRIPT_DT" ADD CONSTRAINT "ABA0225_SB_SUBSCRIPT_DT_PK" PRIMARY KEY ("ABA0225_SB_SUB_DETAIL_ID")																																							
USING INDEX "MS9ABA"."ABA0225_PK_INDEX"  ENABLE;																																							
ALTER TABLE "MS9ABA"."ABA0225_SB_SUBSCRIPT_DT" MODIFY ("ABA0225_SB_SUB_DETAIL_ID" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0225_SB_SUBSCRIPT_DT" MODIFY ("ABA0225_SB_SUB_ID" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0225_SB_SUBSCRIPT_DT" MODIFY ("ABA0225_SB_APPLICANT_ID" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0225_SB_SUBSCRIPT_DT" MODIFY ("ABA0225_SB_REFERENCE_NO" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0225_SB_SUBSCRIPT_DT" MODIFY ("ABA0225_SB_TRANS_REF" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0225_SB_SUBSCRIPT_DT" MODIFY ("ABA0225_SB_SUB_METHOD" NOT NULL ENABLE);																																							
--------------------------------------------------------																																							
--  Constraints for Table ABA0225_SB_SUBSCRIPT_DT_BKUP																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0225_SB_SUBSCRIPT_DT_BKUP" MODIFY ("ABA0225_SB_SUB_METHOD" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0225_SB_SUBSCRIPT_DT_BKUP" MODIFY ("ABA0225_SB_SUB_DETAIL_ID" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0225_SB_SUBSCRIPT_DT_BKUP" MODIFY ("ABA0225_SB_SUB_ID" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0225_SB_SUBSCRIPT_DT_BKUP" MODIFY ("ABA0225_SB_APPLICANT_ID" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0225_SB_SUBSCRIPT_DT_BKUP" MODIFY ("ABA0225_SB_REFERENCE_NO" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0225_SB_SUBSCRIPT_DT_BKUP" MODIFY ("ABA0225_SB_TRANS_REF" NOT NULL ENABLE);																																							
--------------------------------------------------------																																							
--  Constraints for Table ABA0226_SB_SUBSCRIPT_DT_ERR																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0226_SB_SUBSCRIPT_DT_ERR" ADD CONSTRAINT "ABA0226_PK" PRIMARY KEY ("ABA0226_SB_SUB_DT_ERR_ID")																																							
USING INDEX "MS9ABA"."ABA0226_PK_INDEX"  ENABLE;																																							
ALTER TABLE "MS9ABA"."ABA0226_SB_SUBSCRIPT_DT_ERR" MODIFY ("ABA0226_SB_SUB_DT_ERR_ID" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0226_SB_SUBSCRIPT_DT_ERR" MODIFY ("ABA0226_SB_SUB_ID" NOT NULL ENABLE);																																							
--------------------------------------------------------																																							
--  Constraints for Table ABA0240_SB_CD_SUBMISSION_TYPE																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0240_SB_CD_SUBMISSION_TYPE" ADD CONSTRAINT "ABA0240_PK" PRIMARY KEY ("ABA0240_SB_CD_SUBMIT_TYPE")																																							
USING INDEX "MS9ABA"."ABA0240_PK_INDEX"  ENABLE;																																							
ALTER TABLE "MS9ABA"."ABA0240_SB_CD_SUBMISSION_TYPE" MODIFY ("ABA0240_SB_CD_SUBMIT_TYPE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0240_SB_CD_SUBMISSION_TYPE" MODIFY ("ABA0240_SB_DESCRIPTION" NOT NULL ENABLE);																																							
--------------------------------------------------------																																							
--  Constraints for Table BATCH_JOB_INSTANCE																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."BATCH_JOB_INSTANCE" MODIFY ("JOB_INSTANCE_ID" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."BATCH_JOB_INSTANCE" MODIFY ("JOB_NAME" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."BATCH_JOB_INSTANCE" MODIFY ("JOB_KEY" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."BATCH_JOB_INSTANCE" ADD CONSTRAINT "JOB_INST_UN" UNIQUE ("JOB_NAME", "JOB_KEY")																																							
USING INDEX "MS9ABA"."JOB_INST_UN"  ENABLE;																																							
ALTER TABLE "MS9ABA"."BATCH_JOB_INSTANCE" ADD CONSTRAINT "BATCH_JOB_INSTANCE_PK" PRIMARY KEY ("JOB_INSTANCE_ID")																																							
USING INDEX "MS9ABA"."BATCH_JOB_INSTANCE_PK_INDEX"  ENABLE;																																							
--------------------------------------------------------																																							
--  Constraints for Table ABA0217_SB_CD_NATION																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0217_SB_CD_NATION" ADD CONSTRAINT "ABA0217_SB_CD_NATION_PK" PRIMARY KEY ("ABA0217_SB_CD_NATION")																																							
USING INDEX "MS9ABA"."ABA0217_PK_INDEX"  ENABLE;																																							
ALTER TABLE "MS9ABA"."ABA0217_SB_CD_NATION" MODIFY ("ABA0217_SB_CD_NATION" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0217_SB_CD_NATION" MODIFY ("ABA0217_SB_DESCRIPTION" NOT NULL ENABLE);																																							
--------------------------------------------------------																																							
--  Constraints for Table ABA0226_SB_SUBSCRIPT_DT_ERR_BKUP																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0226_SB_SUBSCRIPT_DT_ERR_BKUP" MODIFY ("ABA0226_SB_SUB_DT_ERR_ID" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0226_SB_SUBSCRIPT_DT_ERR_BKUP" MODIFY ("ABA0226_SB_SUB_ID" NOT NULL ENABLE);																																							
--------------------------------------------------------																																							
--  Constraints for Table ABA0228_SB_REDEMPTION_DT																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0228_SB_REDEMPTION_DT" ADD CONSTRAINT "ABA0228_SB_REDEMPTION_DT_PK" PRIMARY KEY ("ABA0228_SB_REDEM_DT_ID")																																							
USING INDEX "MS9ABA"."ABA0228_PK_INDEX"  ENABLE;																																							
ALTER TABLE "MS9ABA"."ABA0228_SB_REDEMPTION_DT" MODIFY ("ABA0228_SB_REDEM_DT_ID" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0228_SB_REDEMPTION_DT" MODIFY ("ABA0228_SB_REDEM_ID" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0228_SB_REDEMPTION_DT" MODIFY ("ABA0228_SB_APPLICANT_ID" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0228_SB_REDEMPTION_DT" MODIFY ("ABA0228_SB_ORG_ID" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0228_SB_REDEMPTION_DT" MODIFY ("ABA0228_SB_SECURITY_CODE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0228_SB_REDEMPTION_DT" MODIFY ("ABA0228_SB_ISIN_CODE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0228_SB_REDEMPTION_DT" MODIFY ("ABA0228_SB_TRANS_REF" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0228_SB_REDEMPTION_DT" MODIFY ("ABA0228_SB_SUB_METHOD" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0228_SB_REDEMPTION_DT" MODIFY ("ABA0228_SB_LINE_NUMBER" NOT NULL ENABLE);																																							
--------------------------------------------------------																																							
--  Constraints for Table BATCH_STEP_EXECUTION_CONTEXT																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."BATCH_STEP_EXECUTION_CONTEXT" MODIFY ("STEP_EXECUTION_ID" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."BATCH_STEP_EXECUTION_CONTEXT" MODIFY ("SHORT_CONTEXT" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."BATCH_STEP_EXECUTION_CONTEXT" ADD CONSTRAINT "BSEC_PK" PRIMARY KEY ("STEP_EXECUTION_ID")																																							
USING INDEX "MS9ABA"."BSEC_PK_INDEX"  ENABLE;																																							
--------------------------------------------------------																																							
--  Constraints for Table ABA0231_SB_HLD_INFO_DT_BACKUP																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0231_SB_HLD_INFO_DT_BACKUP" MODIFY ("ABA0231_SB_HLD_INFO_DT_ID" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0231_SB_HLD_INFO_DT_BACKUP" MODIFY ("ABA0231_SB_HLD_INFO_ID" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0231_SB_HLD_INFO_DT_BACKUP" MODIFY ("ABA0231_SB_SECURITY_CODE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0231_SB_HLD_INFO_DT_BACKUP" MODIFY ("ABA0231_SB_ISIN_CODE" NOT NULL ENABLE);																																							
--------------------------------------------------------																																							
--  Constraints for Table BATCH_JOB_EXECUTION_CONTEXT																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."BATCH_JOB_EXECUTION_CONTEXT" ADD CONSTRAINT "BATCH_JOB_EXECUTION_CONTEXT_PK" PRIMARY KEY ("JOB_EXECUTION_ID")																																							
USING INDEX "MS9ABA"."BJEC_PK_INDEX"  ENABLE;																																							
ALTER TABLE "MS9ABA"."BATCH_JOB_EXECUTION_CONTEXT" MODIFY ("JOB_EXECUTION_ID" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."BATCH_JOB_EXECUTION_CONTEXT" MODIFY ("SHORT_CONTEXT" NOT NULL ENABLE);																																							
--------------------------------------------------------																																							
--  Constraints for Table ABA0228_SB_REDEMPTION_DT_BKUP																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0228_SB_REDEMPTION_DT_BKUP" MODIFY ("ABA0228_SB_REDEM_DT_ID" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0228_SB_REDEMPTION_DT_BKUP" MODIFY ("ABA0228_SB_REDEM_ID" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0228_SB_REDEMPTION_DT_BKUP" MODIFY ("ABA0228_SB_APPLICANT_ID" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0228_SB_REDEMPTION_DT_BKUP" MODIFY ("ABA0228_SB_ORG_ID" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0228_SB_REDEMPTION_DT_BKUP" MODIFY ("ABA0228_SB_SECURITY_CODE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0228_SB_REDEMPTION_DT_BKUP" MODIFY ("ABA0228_SB_ISIN_CODE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0228_SB_REDEMPTION_DT_BKUP" MODIFY ("ABA0228_SB_TRANS_REF" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0228_SB_REDEMPTION_DT_BKUP" MODIFY ("ABA0228_SB_SUB_METHOD" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0228_SB_REDEMPTION_DT_BKUP" MODIFY ("ABA0228_SB_LINE_NUMBER" NOT NULL ENABLE);																																							
--------------------------------------------------------																																							
--  Constraints for Table ABA0231_SB_HLD_INFO_DT_BKUP																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0231_SB_HLD_INFO_DT_BKUP" MODIFY ("ABA0231_SB_HLD_INFO_DT_ID" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0231_SB_HLD_INFO_DT_BKUP" MODIFY ("ABA0231_SB_HLD_INFO_ID" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0231_SB_HLD_INFO_DT_BKUP" MODIFY ("ABA0231_SB_SECURITY_CODE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0231_SB_HLD_INFO_DT_BKUP" MODIFY ("ABA0231_SB_ISIN_CODE" NOT NULL ENABLE);																																							
--------------------------------------------------------																																							
--  Constraints for Table ABA0224_SB_SUBSCRIPT																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0224_SB_SUBSCRIPT" ADD CONSTRAINT "ABA0224_SB_SUBSCRIPT_PK" PRIMARY KEY ("ABA0224_SB_SUB_ID")																																							
USING INDEX "MS9ABA"."ABA0224_PK_INDEX"  ENABLE;																																							
ALTER TABLE "MS9ABA"."ABA0224_SB_SUBSCRIPT" MODIFY ("ABA0224_SB_SUB_ID" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0224_SB_SUBSCRIPT" MODIFY ("ABA0224_SB_BATCH_JOB_ID" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0224_SB_SUBSCRIPT" MODIFY ("ABA0224_SB_FILE_NAME" NOT NULL ENABLE);																																							
--------------------------------------------------------																																							
--  Constraints for Table ABA0231_SB_HLD_INFO_DT																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0231_SB_HLD_INFO_DT" MODIFY ("ABA0231_SB_HLD_INFO_DT_ID" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0231_SB_HLD_INFO_DT" MODIFY ("ABA0231_SB_HLD_INFO_ID" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0231_SB_HLD_INFO_DT" MODIFY ("ABA0231_SB_APPLICANT_ID" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0231_SB_HLD_INFO_DT" MODIFY ("ABA0231_SB_SECURITY_CODE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0231_SB_HLD_INFO_DT" MODIFY ("ABA0231_SB_ISIN_CODE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0231_SB_HLD_INFO_DT" ADD CONSTRAINT "ABA0231_SB_HLD_INFO_DT_PK" PRIMARY KEY ("ABA0231_SB_HLD_INFO_DT_ID")																																							
USING INDEX "MS9ABA"."ABA0231_PK_INDEX"  ENABLE;																																							
--------------------------------------------------------																																							
--  Constraints for Table ABA0250_SB_AUDIT_LOG_BKUP																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0250_SB_AUDIT_LOG_BKUP" MODIFY ("ABA0250_SB_AUDIT_ID" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0250_SB_AUDIT_LOG_BKUP" MODIFY ("ABA0250_SB_USER_ID" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0250_SB_AUDIT_LOG_BKUP" MODIFY ("ABA0250_SB_FUNCTION" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0250_SB_AUDIT_LOG_BKUP" MODIFY ("ABA0250_SB_DETAILS" NOT NULL ENABLE);																																							
--------------------------------------------------------																																							
--  Constraints for Table ABA0230_SB_HLD_INFO																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0230_SB_HLD_INFO" ADD CONSTRAINT "ABA0230_SB_HLD_INFO_PK" PRIMARY KEY ("ABA0230_SB_HLD_INFO_ID")																																							
USING INDEX "MS9ABA"."ABA0230_PK_INDEX"  ENABLE;																																							
ALTER TABLE "MS9ABA"."ABA0230_SB_HLD_INFO" MODIFY ("ABA0230_SB_HLD_INFO_ID" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0230_SB_HLD_INFO" MODIFY ("ABA0230_SB_BATCH_JOB_ID" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0230_SB_HLD_INFO" MODIFY ("ABA0230_SB_FILE_NAME" NOT NULL ENABLE);																																							
--------------------------------------------------------																																							
--  Constraints for Table ABA0284_SB_PORTAL_SYNC																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0284_SB_PORTAL_SYNC" MODIFY ("ABA0284_SB_TABLE_ID" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0284_SB_PORTAL_SYNC" MODIFY ("ABA0284_SB_TABLE_NAME" NOT NULL ENABLE);																																							
--------------------------------------------------------																																							
--  Constraints for Table ABA0230_SB_HLD_INFO_BKUP																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0230_SB_HLD_INFO_BKUP" MODIFY ("ABA0230_SB_HLD_INFO_ID" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0230_SB_HLD_INFO_BKUP" MODIFY ("ABA0230_SB_BATCH_JOB_ID" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0230_SB_HLD_INFO_BKUP" MODIFY ("ABA0230_SB_FILE_NAME" NOT NULL ENABLE);																																							
--------------------------------------------------------																																							
--  Constraints for Table ABA0010_EAUCTION_AUCTION_CUTOFF_TIME																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0010_EAUCTION_AUCTION_CUTOFF_TIME" MODIFY ("ABA0010_NAME" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0010_EAUCTION_AUCTION_CUTOFF_TIME" MODIFY ("ABA0010_DEFAULT_CUTOFF_TIME" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0010_EAUCTION_AUCTION_CUTOFF_TIME" MODIFY ("ABA0010_CUTOFF_TIME" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0010_EAUCTION_AUCTION_CUTOFF_TIME" ADD CONSTRAINT "UK_ABA0010" UNIQUE ("ABA0010_NAME")																																							
USING INDEX PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP"  ENABLE;																																							
--------------------------------------------------------																																							
--  Constraints for Table ABA0234_SB_BATCH_JOB_EXECUTION																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0234_SB_BATCH_JOB_EXECUTION" MODIFY ("ABA0234_SB_JOB_EXECUTION_ID" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0234_SB_BATCH_JOB_EXECUTION" MODIFY ("ABA0234_SB_JOB_ID" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0234_SB_BATCH_JOB_EXECUTION" MODIFY ("ABA0234_SB_JOB_STEP" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0234_SB_BATCH_JOB_EXECUTION" MODIFY ("ABA0234_SB_STEP_STATUS" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0234_SB_BATCH_JOB_EXECUTION" ADD CONSTRAINT "ABA0234_PK" PRIMARY KEY ("ABA0234_SB_JOB_EXECUTION_ID")																																							
USING INDEX "MS9ABA"."ABA0234_PK_INDEX"  ENABLE;																																							
--------------------------------------------------------																																							
--  Constraints for Table ABA0035_SECURITY_MASTER_CTG_STG																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0035_SECURITY_MASTER_CTG_STG" ADD CONSTRAINT "PK_ABA0035_SECURITY_MASTER_CTG_STG" PRIMARY KEY ("ABA0035_SECURITY_CODE", "ABA0035_ISSUE_NO")																																							
USING INDEX PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP"  ENABLE;																																							
--------------------------------------------------------																																							
--  Constraints for Table ABA0229_SB_REDEMPTION_DT_ERR_BKUP																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0229_SB_REDEMPTION_DT_ERR_BKUP" MODIFY ("ABA0229_SB_REDEM_DT_ERR_ID" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0229_SB_REDEMPTION_DT_ERR_BKUP" MODIFY ("ABA0229_SB_REDEM_ID" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0229_SB_REDEMPTION_DT_ERR_BKUP" MODIFY ("ABA0229_SB_LINE_NUMBER" NOT NULL ENABLE);																																							
--------------------------------------------------------																																							
--  Constraints for Table ABA0241_SB_RESULT_FILE_BKUP																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0241_SB_RESULT_FILE_BKUP" MODIFY ("ABA0241_SB_RESULT_FILE_ID" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0241_SB_RESULT_FILE_BKUP" MODIFY ("ABA0241_SB_JOB_TYPE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0241_SB_RESULT_FILE_BKUP" MODIFY ("ABA0241_SB_FILE_NAME" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0241_SB_RESULT_FILE_BKUP" MODIFY ("ABA0241_SB_FILE_PATH" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0241_SB_RESULT_FILE_BKUP" MODIFY ("ABA0241_SB_REFERENCE_NAME" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0241_SB_RESULT_FILE_BKUP" MODIFY ("ABA0241_SB_REFERENCE_NUMBER" NOT NULL ENABLE);																																							
--------------------------------------------------------																																							
--  Constraints for Table ABA233_SB_BATCH_JOB_BKUP																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA233_SB_BATCH_JOB_BKUP" MODIFY ("ABA0233_SB_JOB_ID" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA233_SB_BATCH_JOB_BKUP" MODIFY ("ABA0233_SB_JOB_TYPE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA233_SB_BATCH_JOB_BKUP" MODIFY ("ABA0233_SB_JOB_INSTANCE_ID" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA233_SB_BATCH_JOB_BKUP" MODIFY ("ABA0233_SB_CREATED_DT" NOT NULL ENABLE);																																							
--------------------------------------------------------																																							
--  Constraints for Table ABA0001_SECURITY_MASTER_R2_20231212																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0001_SECURITY_MASTER_R2_20231212" MODIFY ("ABA0001_SECURITY_NAME" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0001_SECURITY_MASTER_R2_20231212" MODIFY ("ABA0001_ISSUE_DATE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0001_SECURITY_MASTER_R2_20231212" MODIFY ("ABA0001_TENDER_DATE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0001_SECURITY_MASTER_R2_20231212" MODIFY ("ABA0001_ISSUE_SIZE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0001_SECURITY_MASTER_R2_20231212" MODIFY ("ABA0001_MATURITY_DATE" NOT NULL ENABLE);																																							
--------------------------------------------------------																																							
--  Constraints for Table ABA0224_SB_SUBSCRIPT_BKUP																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0224_SB_SUBSCRIPT_BKUP" MODIFY ("ABA0224_SB_SUB_ID" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0224_SB_SUBSCRIPT_BKUP" MODIFY ("ABA0224_SB_BATCH_JOB_ID" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0224_SB_SUBSCRIPT_BKUP" MODIFY ("ABA0224_SB_FILE_NAME" NOT NULL ENABLE);																																							
--------------------------------------------------------																																							
--  Constraints for Table ABA0227_SB_REDEMPTION_BKUP																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0227_SB_REDEMPTION_BKUP" MODIFY ("ABA0227_SB_REDEM_ID" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0227_SB_REDEMPTION_BKUP" MODIFY ("ABA0227_SB_BATCH_JOB_ID" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0227_SB_REDEMPTION_BKUP" MODIFY ("ABA0227_SB_FILE_NAME" NOT NULL ENABLE);																																							
--------------------------------------------------------																																							
--  Constraints for Table ABA0006_AUCTION_RESULT																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0006_AUCTION_RESULT" ADD CONSTRAINT "PK_ABA0006_AUCTION_RESULT" PRIMARY KEY ("ABA0006_SECURITY_CODE", "ABA0006_ISSUE_NO", "ABA0006_BANK_ACC_CODE", "ABA0006_TENDER_DATE", "ABA0006_LINE_NO")																																							
USING INDEX "MS9ABA"."PK_ABA0006_AUCTION_RESULT"  ENABLE;																																							
ALTER TABLE "MS9ABA"."ABA0006_AUCTION_RESULT" MODIFY ("ABA0006_SECURITY_CODE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0006_AUCTION_RESULT" MODIFY ("ABA0006_ISSUE_NO" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0006_AUCTION_RESULT" MODIFY ("ABA0006_BANK_ACC_CODE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0006_AUCTION_RESULT" MODIFY ("ABA0006_TENDER_DATE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0006_AUCTION_RESULT" MODIFY ("ABA0006_LINE_NO" NOT NULL ENABLE);																																							
--------------------------------------------------------																																							
--  Constraints for Table ABA0212_SB_REPORT																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0212_SB_REPORT" ADD CONSTRAINT "ABA0212_SB_REPORT_PK" PRIMARY KEY ("ABA0212_SB_REPORT_ID")																																							
USING INDEX "MS9ABA"."ABA0212_PK_INDEX"  ENABLE;																																							
ALTER TABLE "MS9ABA"."ABA0212_SB_REPORT" MODIFY ("ABA0212_SB_REPORT_ID" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0212_SB_REPORT" MODIFY ("ABA0212_SB_REPORT_NAME" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0212_SB_REPORT" MODIFY ("ABA0212_SB_REPORT_TYPE" NOT NULL ENABLE);																																							
--------------------------------------------------------																																							
--  Constraints for Table ABA0232_SB_ALLOTMENT_RESULT_BKUP																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0232_SB_ALLOTMENT_RESULT_BKUP" MODIFY ("ABA0232_SB_ALLOT_RESULT_ID" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0232_SB_ALLOTMENT_RESULT_BKUP" MODIFY ("ABA0232_SB_BATCH_JOB_ID" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0232_SB_ALLOTMENT_RESULT_BKUP" MODIFY ("ABA0232_SB_SUB_DETAIL_ID" NOT NULL ENABLE);																																							
--------------------------------------------------------																																							
--  Constraints for Table ABA0222_SB_ORG																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0222_SB_ORG" ADD CONSTRAINT "ABA0222_SB_ORG_PK" PRIMARY KEY ("ABA0222_SB_ORG_ID")																																							
USING INDEX "MS9ABA"."ABA0222_PK_INDEX"  ENABLE;																																							
ALTER TABLE "MS9ABA"."ABA0222_SB_ORG" MODIFY ("ABA0222_SB_ORG_ID" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0222_SB_ORG" MODIFY ("ABA0222_SB_ORG_TYPE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0222_SB_ORG" MODIFY ("ABA0222_SB_ORG_CODE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0222_SB_ORG" MODIFY ("ABA0222_SB_ORG_NAME" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0222_SB_ORG" MODIFY ("ABA0222_SB_ORG_NAME_DESC" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0222_SB_ORG" MODIFY ("ABA0222_SB_MEMEBER_CODE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0222_SB_ORG" MODIFY ("ABA0222_SB_CUSTODY_CODE" NOT NULL ENABLE);																																							
--------------------------------------------------------																																							
--  Constraints for Table ABA0001_SECURITY_MASTER_20230516																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0001_SECURITY_MASTER_20230516" MODIFY ("ABA0001_SECURITY_NAME" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0001_SECURITY_MASTER_20230516" MODIFY ("ABA0001_ISSUE_DATE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0001_SECURITY_MASTER_20230516" MODIFY ("ABA0001_TENDER_DATE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0001_SECURITY_MASTER_20230516" MODIFY ("ABA0001_ISSUE_SIZE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0001_SECURITY_MASTER_20230516" MODIFY ("ABA0001_MATURITY_DATE" NOT NULL ENABLE);																																							
--------------------------------------------------------																																							
--  Constraints for Table ABA0220_SB_CD_RECORD_ERR_DESC																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0220_SB_CD_RECORD_ERR_DESC" ADD CONSTRAINT "ABA0220_PK" PRIMARY KEY ("ABA0220_SB_CD_RECORD_ERR_DESC")																																							
USING INDEX "MS9ABA"."ABA0220_PK_INDEX"  ENABLE;																																							
ALTER TABLE "MS9ABA"."ABA0220_SB_CD_RECORD_ERR_DESC" MODIFY ("ABA0220_SB_CD_RECORD_ERR_DESC" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0220_SB_CD_RECORD_ERR_DESC" MODIFY ("ABA0220_SB_DESCRIPTION" NOT NULL ENABLE);																																							
--------------------------------------------------------																																							
--  Constraints for Table ABA0250_SB_AUDIT_LOG																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0250_SB_AUDIT_LOG" ADD CONSTRAINT "ABA0250_SB_AUDIT_LOG_PK" PRIMARY KEY ("ABA0250_SB_AUDIT_ID")																																							
USING INDEX "MS9ABA"."ABA0250_PK_INDEX"  ENABLE;																																							
ALTER TABLE "MS9ABA"."ABA0250_SB_AUDIT_LOG" MODIFY ("ABA0250_SB_AUDIT_ID" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0250_SB_AUDIT_LOG" MODIFY ("ABA0250_SB_USER_ID" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0250_SB_AUDIT_LOG" MODIFY ("ABA0250_SB_FUNCTION" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0250_SB_AUDIT_LOG" MODIFY ("ABA0250_SB_DETAILS" NOT NULL ENABLE);																																							
--------------------------------------------------------																																							
--  Constraints for Table ABA0008_AUCTION_AUDIT_LOG																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0008_AUCTION_AUDIT_LOG" MODIFY ("ABA0008_USER_ID" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0008_AUCTION_AUDIT_LOG" MODIFY ("ABA0008_ACTION" NOT NULL ENABLE);																																							
--------------------------------------------------------																																							
--  Constraints for Table ABA0236_SB_HLD_INFO_DT_ERR																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0236_SB_HLD_INFO_DT_ERR" ADD CONSTRAINT "ABA0236_SB_HLD_INFO_DT_ERR_PK" PRIMARY KEY ("ABA0236_SB_HLD_INFO_DT_ERR_ID")																																							
USING INDEX "MS9ABA"."ABA0236_PK_INDEX"  ENABLE;																																							
ALTER TABLE "MS9ABA"."ABA0236_SB_HLD_INFO_DT_ERR" MODIFY ("ABA0236_SB_HLD_INFO_DT_ERR_ID" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0236_SB_HLD_INFO_DT_ERR" MODIFY ("ABA0236_SB_HLD_INFO_ID" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0236_SB_HLD_INFO_DT_ERR" MODIFY ("ABA0236_SB_CD_RECORD_ERR_DESC" NOT NULL ENABLE);																																							
--------------------------------------------------------																																							
--  Constraints for Table ABA0238_SB_LEVEL_ACTION																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0238_SB_LEVEL_ACTION" ADD CONSTRAINT "ABA0238_SB_LEVEL_ACTION_PK" PRIMARY KEY ("ABA0238_SB_LEVEL", "ABA0238_SB_MODULE")																																							
USING INDEX "MS9ABA"."ABA0238_PK_INDEX"  ENABLE;																																							
ALTER TABLE "MS9ABA"."ABA0238_SB_LEVEL_ACTION" MODIFY ("ABA0238_SB_MODULE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0238_SB_LEVEL_ACTION" MODIFY ("ABA0238_SB_ACTION" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0238_SB_LEVEL_ACTION" MODIFY ("ABA0238_SB_LEVEL" NOT NULL ENABLE);																																							
--------------------------------------------------------																																							
--  Constraints for Table ABA0216_SB_CD_RECORD_STATUS																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0216_SB_CD_RECORD_STATUS" ADD CONSTRAINT "ABA0216_SB_CD_RECORD_STATUS_PK" PRIMARY KEY ("ABA0216_SB_CD_RECORD_STATUS")																																							
USING INDEX "MS9ABA"."ABA0216_PK_INDEX"  ENABLE;																																							
ALTER TABLE "MS9ABA"."ABA0216_SB_CD_RECORD_STATUS" MODIFY ("ABA0216_SB_CD_RECORD_STATUS" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0216_SB_CD_RECORD_STATUS" MODIFY ("ABA0216_SB_DESCRIPTION" NOT NULL ENABLE);																																							
--------------------------------------------------------																																							
--  Constraints for Table ABA0239_SB_ACTION_REF																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0239_SB_ACTION_REF" ADD CONSTRAINT "ABA0239_SB_ACTION_REF_PK" PRIMARY KEY ("ABA0239_SB_MODULE")																																							
USING INDEX "MS9ABA"."ABA0239_PK_INDEX"  ENABLE;																																							
ALTER TABLE "MS9ABA"."ABA0239_SB_ACTION_REF" MODIFY ("ABA0239_SB_MODULE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0239_SB_ACTION_REF" MODIFY ("ABA0239_SB_ACTION" NOT NULL ENABLE);																																							
--------------------------------------------------------																																							
--  Constraints for Table ABA0036_RETAILBID_FILE																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0036_RETAILBID_FILE" MODIFY ("ABA0036_FILE_NAME" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0036_RETAILBID_FILE" MODIFY ("ABA0036_PROCESSING_DATE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0036_RETAILBID_FILE" ADD CONSTRAINT "UK_ABA0036" UNIQUE ("ABA0036_FILE_NAME", "ABA0036_PROCESSING_DATE", "ABA0036_ACKNOWLEDGEMENT_FILE_NAME")																																							
USING INDEX PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP"  ENABLE;																																							
--------------------------------------------------------																																							
--  Constraints for Table ABA0214_SB_CD_FILE_TYPE																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0214_SB_CD_FILE_TYPE" ADD CONSTRAINT "ABA0214_SB_CD_FILE_TYPE_PK" PRIMARY KEY ("ABA0214_SB_CD_FILE_TYPE")																																							
USING INDEX "MS9ABA"."ABA0214_PK_INDEX"  ENABLE;																																							
ALTER TABLE "MS9ABA"."ABA0214_SB_CD_FILE_TYPE" MODIFY ("ABA0214_SB_CD_FILE_TYPE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0214_SB_CD_FILE_TYPE" MODIFY ("ABA0214_SB_DESCRIPTION" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0214_SB_CD_FILE_TYPE" MODIFY ("ABA0214_SB_OBS_IND" NOT NULL ENABLE);																																							
--------------------------------------------------------																																							
--  Constraints for Table ABA0251_SB_CONT_MAKE_CHECK																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0251_SB_CONT_MAKE_CHECK" ADD CONSTRAINT "ABA0251_SB_CONT_MAKE_CHECK_PK" PRIMARY KEY ("ABA0251_ID")																																							
USING INDEX "MS9ABA"."ABA0251_PK_INDEX"  ENABLE;																																							
ALTER TABLE "MS9ABA"."ABA0251_SB_CONT_MAKE_CHECK" MODIFY ("ABA0251_ID" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0251_SB_CONT_MAKE_CHECK" MODIFY ("ABA0251_SB_BANK_CODE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0251_SB_CONT_MAKE_CHECK" MODIFY ("ABA0251_SB_FILE_TYPE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0251_SB_CONT_MAKE_CHECK" MODIFY ("ABA0251_SB_IDENTIFIER" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0251_SB_CONT_MAKE_CHECK" MODIFY ("ABA0251_SB_PROCESS_DT" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0251_SB_CONT_MAKE_CHECK" MODIFY ("ABA0251_SB_REQUESTOR" NOT NULL ENABLE);																																							
--------------------------------------------------------																																							
--  Constraints for Table ABA0281_SB_TEMP_HOLDING																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0281_SB_TEMP_HOLDING" ADD CONSTRAINT "ABA0281_SB_TEMP_HOLDING_PK" PRIMARY KEY ("ABA0281_SB_IC_PASSPORT")																																							
USING INDEX "MS9ABA"."ABA0281_PK_INDEX"  ENABLE;																																							
ALTER TABLE "MS9ABA"."ABA0281_SB_TEMP_HOLDING" MODIFY ("ABA0281_SB_IC_PASSPORT" NOT NULL ENABLE);																																							
--------------------------------------------------------																																							
--  Constraints for Table ABA0280_SB_TEMP_APP_SUB_DT																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0280_SB_TEMP_APP_SUB_DT" ADD CONSTRAINT "ABA0280_SB_TEMP_APP_SUB_DT_PK" PRIMARY KEY ("ABA0280_SB_IC_PASSPORT")																																							
USING INDEX "MS9ABA"."ABA0280_PK_INDEX"  ENABLE;																																							
ALTER TABLE "MS9ABA"."ABA0280_SB_TEMP_APP_SUB_DT" MODIFY ("ABA0280_SB_IC_PASSPORT" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0280_SB_TEMP_APP_SUB_DT" MODIFY ("ABA0280_SB_SECURITY_CODE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0280_SB_TEMP_APP_SUB_DT" MODIFY ("ABA0280_SB_SUBSCRIPTION_AMT" NOT NULL ENABLE);																																							
--------------------------------------------------------																																							
--  Constraints for Table TESTSYNC																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."TESTSYNC" MODIFY ("ABA0284_SB_TABLE_ID" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."TESTSYNC" MODIFY ("ABA0284_SB_TABLE_NAME" NOT NULL ENABLE);																																							
--------------------------------------------------------																																							
--  Constraints for Table ABA0007_DETAIL_AUCTION_RESULT																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0007_DETAIL_AUCTION_RESULT" ADD CONSTRAINT "PK_ABA0007_IND_AUCT_RESULT" PRIMARY KEY ("ABA0007_SECURITY_CODE", "ABA0007_ISSUE_NO", "ABA0007_FORM_NO")																																							
USING INDEX "MS9ABA"."PK_ABA0007_IND_AUCT_RESULT"  ENABLE;																																							
ALTER TABLE "MS9ABA"."ABA0007_DETAIL_AUCTION_RESULT" MODIFY ("ABA0007_SECURITY_CODE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0007_DETAIL_AUCTION_RESULT" MODIFY ("ABA0007_ISSUE_NO" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0007_DETAIL_AUCTION_RESULT" MODIFY ("ABA0007_FORM_NO" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0007_DETAIL_AUCTION_RESULT" MODIFY ("ABA0007_TENDER_DATE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0007_DETAIL_AUCTION_RESULT" MODIFY ("ABA0007_PRI_DLR_CODE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0007_DETAIL_AUCTION_RESULT" MODIFY ("ABA0007_FILE_TYPE" NOT NULL ENABLE);																																							
--------------------------------------------------------																																							
--  Constraints for Table ABA0233_SB_BATCH_JOB																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0233_SB_BATCH_JOB" ADD CONSTRAINT "ABA0233_SB_BATCH_JOB_PK" PRIMARY KEY ("ABA0233_SB_JOB_ID")																																							
USING INDEX "MS9ABA"."ABA0233_PK_INDEX"  ENABLE;																																							
ALTER TABLE "MS9ABA"."ABA0233_SB_BATCH_JOB" MODIFY ("ABA0233_SB_JOB_ID" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0233_SB_BATCH_JOB" MODIFY ("ABA0233_SB_JOB_TYPE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0233_SB_BATCH_JOB" MODIFY ("ABA0233_SB_JOB_INSTANCE_ID" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0233_SB_BATCH_JOB" MODIFY ("ABA0233_SB_CREATED_DT" NOT NULL ENABLE);																																							
--------------------------------------------------------																																							
--  Constraints for Table ABA0234_SB_BATCH_JOB_EXECUTION_BKUP																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0234_SB_BATCH_JOB_EXECUTION_BKUP" MODIFY ("ABA0234_SB_JOB_EXECUTION_ID" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0234_SB_BATCH_JOB_EXECUTION_BKUP" MODIFY ("ABA0234_SB_JOB_ID" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0234_SB_BATCH_JOB_EXECUTION_BKUP" MODIFY ("ABA0234_SB_JOB_STEP" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0234_SB_BATCH_JOB_EXECUTION_BKUP" MODIFY ("ABA0234_SB_STEP_STATUS" NOT NULL ENABLE);																																							
--------------------------------------------------------																																							
--  Constraints for Table BATCH_JOB_EXECUTION																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."BATCH_JOB_EXECUTION" ADD CONSTRAINT "BATCH_JOB_EXECUTION_PK" PRIMARY KEY ("JOB_EXECUTION_ID")																																							
USING INDEX "MS9ABA"."BATCH_JOB_EXECUTION_PK_INDEX"  ENABLE;																																							
ALTER TABLE "MS9ABA"."BATCH_JOB_EXECUTION" MODIFY ("JOB_EXECUTION_ID" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."BATCH_JOB_EXECUTION" MODIFY ("JOB_INSTANCE_ID" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."BATCH_JOB_EXECUTION" MODIFY ("CREATE_TIME" NOT NULL ENABLE);																																							
--------------------------------------------------------																																							
--  Constraints for Table ABA0009_EAUCTION_CONFIG																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0009_EAUCTION_CONFIG" ADD CONSTRAINT "PK_ ABA0009_EAUCTION_CONFIG" PRIMARY KEY ("ABA0009_KEY")																																							
USING INDEX PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "ABAAPP"  ENABLE;																																							
ALTER TABLE "MS9ABA"."ABA0009_EAUCTION_CONFIG" MODIFY ("ABA0009_KEY" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0009_EAUCTION_CONFIG" MODIFY ("ABA0009_VALUE" NOT NULL ENABLE);																																							
--------------------------------------------------------																																							
--  Constraints for Table ABA0236_SB_HLD_INFO_DT_ERR_BKUP																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0236_SB_HLD_INFO_DT_ERR_BKUP" MODIFY ("ABA0236_SB_HLD_INFO_DT_ERR_ID" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0236_SB_HLD_INFO_DT_ERR_BKUP" MODIFY ("ABA0236_SB_HLD_INFO_ID" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0236_SB_HLD_INFO_DT_ERR_BKUP" MODIFY ("ABA0236_SB_CD_RECORD_ERR_DESC" NOT NULL ENABLE);																																							
--------------------------------------------------------																																							
--  Constraints for Table BATCH_STEP_EXECUTION																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."BATCH_STEP_EXECUTION" ADD CONSTRAINT "BATCH_STEP_EXECUTION_PK" PRIMARY KEY ("STEP_EXECUTION_ID")																																							
USING INDEX "MS9ABA"."BATCH_STEP_EXECUTION_PK_INDEX"  ENABLE;																																							
ALTER TABLE "MS9ABA"."BATCH_STEP_EXECUTION" MODIFY ("STEP_EXECUTION_ID" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."BATCH_STEP_EXECUTION" MODIFY ("VERSION" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."BATCH_STEP_EXECUTION" MODIFY ("STEP_NAME" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."BATCH_STEP_EXECUTION" MODIFY ("JOB_EXECUTION_ID" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."BATCH_STEP_EXECUTION" MODIFY ("START_TIME" NOT NULL ENABLE);																																							
--------------------------------------------------------																																							
--  Constraints for Table ABA0237_SB_USER																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0237_SB_USER" ADD CONSTRAINT "ABA0237_SB_USER_PK" PRIMARY KEY ("ABA0237_SB_USER_ID")																																							
USING INDEX "MS9ABA"."ABA0237_PK_INDEX"  ENABLE;																																							
ALTER TABLE "MS9ABA"."ABA0237_SB_USER" MODIFY ("ABA0237_SB_USER_ID" NOT NULL ENABLE);																																							
--------------------------------------------------------																																							
--  Constraints for Table ABA0213_SB_REPORT_FILE																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0213_SB_REPORT_FILE" ADD CONSTRAINT "ABA0213_SB_REPORT_FILE_PK" PRIMARY KEY ("ABA0213_SB_REPORT_FILE_ID")																																							
USING INDEX "MS9ABA"."ABA0213_PK_INDEX"  ENABLE;																																							
ALTER TABLE "MS9ABA"."ABA0213_SB_REPORT_FILE" MODIFY ("ABA0213_SB_REPORT_FILE_ID" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0213_SB_REPORT_FILE" MODIFY ("ABA0213_SB_REPORT_ID" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0213_SB_REPORT_FILE" MODIFY ("ABA0213_SB_FILE_NAME" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0213_SB_REPORT_FILE" MODIFY ("ABA0213_SB_FILE_DESC" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0213_SB_REPORT_FILE" MODIFY ("ABA0213_SB_FILE_MIMETYPE" NOT NULL ENABLE);																																							
--------------------------------------------------------																																							
--  Constraints for Table ABA0215_SB_CD_FILE_STATUS																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0215_SB_CD_FILE_STATUS" ADD CONSTRAINT "ABA0215_SB_CD_FILE_STATUS_PK" PRIMARY KEY ("ABA0215_SB_CD_FILE_STATUS")																																							
USING INDEX "MS9ABA"."ABA0215_PK_INDEX"  ENABLE;																																							
ALTER TABLE "MS9ABA"."ABA0215_SB_CD_FILE_STATUS" MODIFY ("ABA0215_SB_CD_FILE_STATUS" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0215_SB_CD_FILE_STATUS" MODIFY ("ABA0215_SB_DESCRIPTION" NOT NULL ENABLE);																																							
--------------------------------------------------------																																							
--  Constraints for Table ABA0219_SB_CD_FILE_ERROR_DESC																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0219_SB_CD_FILE_ERROR_DESC" ADD CONSTRAINT "ABA0219_PK" PRIMARY KEY ("ABA0219_SB_CD_FILE_ERR_DESC")																																							
USING INDEX "MS9ABA"."ABA0219_PK_INDEX"  ENABLE;																																							
ALTER TABLE "MS9ABA"."ABA0219_SB_CD_FILE_ERROR_DESC" MODIFY ("ABA0219_SB_CD_FILE_ERR_DESC" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0219_SB_CD_FILE_ERROR_DESC" MODIFY ("ABA0219_SB_DESCRIPTION" NOT NULL ENABLE);																																							
--------------------------------------------------------																																							
--  Constraints for Table BATCH_JOB_EXECUTION_PARAMS																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."BATCH_JOB_EXECUTION_PARAMS" MODIFY ("JOB_EXECUTION_ID" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."BATCH_JOB_EXECUTION_PARAMS" MODIFY ("TYPE_CD" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."BATCH_JOB_EXECUTION_PARAMS" MODIFY ("KEY_NAME" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."BATCH_JOB_EXECUTION_PARAMS" MODIFY ("IDENTIFYING" NOT NULL ENABLE);																																							
--------------------------------------------------------																																							
--  Constraints for Table ABA0233_SB_BATCH_JOB_BKUP																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0233_SB_BATCH_JOB_BKUP" MODIFY ("ABA0233_SB_JOB_ID" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0233_SB_BATCH_JOB_BKUP" MODIFY ("ABA0233_SB_JOB_TYPE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0233_SB_BATCH_JOB_BKUP" MODIFY ("ABA0233_SB_JOB_INSTANCE_ID" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0233_SB_BATCH_JOB_BKUP" MODIFY ("ABA0233_SB_CREATED_DT" NOT NULL ENABLE);																																							
--------------------------------------------------------																																							
--  Constraints for Table ABA0284_SB_PORTAL_SYNC_BK																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0284_SB_PORTAL_SYNC_BK" MODIFY ("ABA0284_SB_TABLE_ID" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0284_SB_PORTAL_SYNC_BK" MODIFY ("ABA0284_SB_TABLE_NAME" NOT NULL ENABLE);																																							
--------------------------------------------------------																																							
--  Constraints for Table ABA0001_SECURITY_MASTER																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0001_SECURITY_MASTER" ADD CONSTRAINT "PK_ABA0001_SECURITY_MASTER" PRIMARY KEY ("ABA0001_SECURITY_CODE", "ABA0001_ISSUE_NO")																																							
USING INDEX "MS9ABA"."PK_ABA0001_SECURITY_MASTER"  ENABLE;																																							
ALTER TABLE "MS9ABA"."ABA0001_SECURITY_MASTER" MODIFY ("ABA0001_SECURITY_NAME" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0001_SECURITY_MASTER" MODIFY ("ABA0001_ISSUE_DATE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0001_SECURITY_MASTER" MODIFY ("ABA0001_TENDER_DATE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0001_SECURITY_MASTER" MODIFY ("ABA0001_ISSUE_SIZE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0001_SECURITY_MASTER" MODIFY ("ABA0001_MATURITY_DATE" NOT NULL ENABLE);																																							
--------------------------------------------------------																																							
--  Constraints for Table ABA0235_SB_SUBMISSION_SUMMARY_BKUP																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0235_SB_SUBMISSION_SUMMARY_BKUP" MODIFY ("ABA0235_SB_SUBMISSION_SUM_ID" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0235_SB_SUBMISSION_SUMMARY_BKUP" MODIFY ("ABA0235_SB_JOB_ID" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0235_SB_SUBMISSION_SUMMARY_BKUP" MODIFY ("ABA0235_SB_ORG_ID" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0235_SB_SUBMISSION_SUMMARY_BKUP" MODIFY ("ABA0235_SB_SECURITY_CODE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0235_SB_SUBMISSION_SUMMARY_BKUP" MODIFY ("ABA0235_SB_QTY_REJECTED" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0235_SB_SUBMISSION_SUMMARY_BKUP" MODIFY ("ABA0235_SB_QTY_SUBMITTED" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0235_SB_SUBMISSION_SUMMARY_BKUP" MODIFY ("ABA0235_SB_QTY_SUCCESS" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0235_SB_SUBMISSION_SUMMARY_BKUP" MODIFY ("ABA0235_SB_TOTAL_AMT_SUBMIT" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0235_SB_SUBMISSION_SUMMARY_BKUP" MODIFY ("ABA0235_SB_TOTAL_AMT_SUCCESS" NOT NULL ENABLE);																																							
--------------------------------------------------------																																							
--  Constraints for Table ABA0282_SB_CD_APPLICATION_TYPE																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0282_SB_CD_APPLICATION_TYPE" MODIFY ("ABA0282_SB_CD_APPLICATION_TYPE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0282_SB_CD_APPLICATION_TYPE" MODIFY ("ABA0282_SB_DESCRIPTION" NOT NULL ENABLE);																																							
--------------------------------------------------------																																							
--  Constraints for Table ABA0227_SB_REDEMPTION																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0227_SB_REDEMPTION" ADD CONSTRAINT "ABA0227_SB_REDEMPTION_PK" PRIMARY KEY ("ABA0227_SB_REDEM_ID")																																							
USING INDEX "MS9ABA"."ABA0227_PK_INDEX"  ENABLE;																																							
ALTER TABLE "MS9ABA"."ABA0227_SB_REDEMPTION" MODIFY ("ABA0227_SB_REDEM_ID" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0227_SB_REDEMPTION" MODIFY ("ABA0227_SB_BATCH_JOB_ID" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0227_SB_REDEMPTION" MODIFY ("ABA0227_SB_FILE_NAME" NOT NULL ENABLE);																																							
--------------------------------------------------------																																							
--  Ref Constraints for Table ABA0213_SB_REPORT_FILE																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0213_SB_REPORT_FILE" ADD CONSTRAINT "FK_ABA0213_SB_REPORT_ID" FOREIGN KEY ("ABA0213_SB_REPORT_ID")																																							
	REFERENCES "MS9ABA"."ABA0212_SB_REPORT" ("ABA0212_SB_REPORT_ID") ENABLE;																																						
--------------------------------------------------------																																							
--  Ref Constraints for Table ABA0223_SB_APPLICANT																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0223_SB_APPLICANT" ADD CONSTRAINT "FK_ABA_223_217_CD_NATION" FOREIGN KEY ("ABA0223_SB_CD_NATION")																																							
	REFERENCES "MS9ABA"."ABA0217_SB_CD_NATION" ("ABA0217_SB_CD_NATION") ENABLE;																																						
--------------------------------------------------------																																							
--  Ref Constraints for Table ABA0224_SB_SUBSCRIPT																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0224_SB_SUBSCRIPT" ADD CONSTRAINT "FK_ABA_224_222_ORG_ID" FOREIGN KEY ("ABA0224_SB_ORG_ID")																																							
	REFERENCES "MS9ABA"."ABA0222_SB_ORG" ("ABA0222_SB_ORG_ID") ENABLE;																																						
ALTER TABLE "MS9ABA"."ABA0224_SB_SUBSCRIPT" ADD CONSTRAINT "FK_ABA_224_214_CD_FILE_TYPE" FOREIGN KEY ("ABA0224_SB_CD_FILE_TYPE")																																							
	REFERENCES "MS9ABA"."ABA0214_SB_CD_FILE_TYPE" ("ABA0214_SB_CD_FILE_TYPE") ENABLE;																																						
ALTER TABLE "MS9ABA"."ABA0224_SB_SUBSCRIPT" ADD CONSTRAINT "FK_ABA_224_233_BATCH_JOB_ID" FOREIGN KEY ("ABA0224_SB_BATCH_JOB_ID")																																							
	REFERENCES "MS9ABA"."ABA0233_SB_BATCH_JOB" ("ABA0233_SB_JOB_ID") ENABLE;																																						
ALTER TABLE "MS9ABA"."ABA0224_SB_SUBSCRIPT" ADD CONSTRAINT "FK_ABA_224_219_CD_FILE_ERR_DES" FOREIGN KEY ("ABA0224_SB_CD_FILE_ERROR_DESC")																																							
	REFERENCES "MS9ABA"."ABA0219_SB_CD_FILE_ERROR_DESC" ("ABA0219_SB_CD_FILE_ERR_DESC") ENABLE;																																						
ALTER TABLE "MS9ABA"."ABA0224_SB_SUBSCRIPT" ADD CONSTRAINT "FK_ABA_224_215_CD_FILE_STATUS" FOREIGN KEY ("ABA0224_SB_CD_FILE_STATUS")																																							
	REFERENCES "MS9ABA"."ABA0215_SB_CD_FILE_STATUS" ("ABA0215_SB_CD_FILE_STATUS") ENABLE;																																						
--------------------------------------------------------																																							
--  Ref Constraints for Table ABA0225_SB_SUBSCRIPT_DT																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0225_SB_SUBSCRIPT_DT" ADD CONSTRAINT "FK_ABA_225_223_APPLICANT_ID" FOREIGN KEY ("ABA0225_SB_APPLICANT_ID")																																							
	REFERENCES "MS9ABA"."ABA0223_SB_APPLICANT" ("ABA0223_SB_APPLICANT_ID") ENABLE;																																						
ALTER TABLE "MS9ABA"."ABA0225_SB_SUBSCRIPT_DT" ADD CONSTRAINT "FK_ABA_225_224_SUB_ID" FOREIGN KEY ("ABA0225_SB_SUB_ID")																																							
	REFERENCES "MS9ABA"."ABA0224_SB_SUBSCRIPT" ("ABA0224_SB_SUB_ID") ENABLE;																																						
ALTER TABLE "MS9ABA"."ABA0225_SB_SUBSCRIPT_DT" ADD CONSTRAINT "FK_ABA_225_240_CD_SUB_TYPE" FOREIGN KEY ("ABA0225_SB_SUB_METHOD")																																							
	REFERENCES "MS9ABA"."ABA0240_SB_CD_SUBMISSION_TYPE" ("ABA0240_SB_CD_SUBMIT_TYPE") ENABLE;																																						
ALTER TABLE "MS9ABA"."ABA0225_SB_SUBSCRIPT_DT" ADD CONSTRAINT "FK_ABA_225_216_CD_RD_STATUS" FOREIGN KEY ("ABA0225_SB_CD_RECORD_STATUS")																																							
	REFERENCES "MS9ABA"."ABA0216_SB_CD_RECORD_STATUS" ("ABA0216_SB_CD_RECORD_STATUS") ENABLE;																																						
--------------------------------------------------------																																							
--  Ref Constraints for Table ABA0226_SB_SUBSCRIPT_DT_ERR																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0226_SB_SUBSCRIPT_DT_ERR" ADD CONSTRAINT "FK_83WIQO5CN1L1XGDS5UAE2QG8W" FOREIGN KEY ("ABA0226_SB_CD_RECORD_ERR_DESC")																																							
	REFERENCES "MS9ABA"."ABA0220_SB_CD_RECORD_ERR_DESC" ("ABA0220_SB_CD_RECORD_ERR_DESC") ENABLE;																																						
ALTER TABLE "MS9ABA"."ABA0226_SB_SUBSCRIPT_DT_ERR" ADD CONSTRAINT "FK_C9N5FK6T3AWP9XKNSQ383G77H" FOREIGN KEY ("ABA0226_SB_SUB_ID")																																							
	REFERENCES "MS9ABA"."ABA0224_SB_SUBSCRIPT" ("ABA0224_SB_SUB_ID") ENABLE;																																						
--------------------------------------------------------																																							
--  Ref Constraints for Table ABA0227_SB_REDEMPTION																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0227_SB_REDEMPTION" ADD CONSTRAINT "FK_ABA_277_219_CD_FILE_ERR_DES" FOREIGN KEY ("ABA0227_SB_CD_FILE_ERR_DESC")																																							
	REFERENCES "MS9ABA"."ABA0219_SB_CD_FILE_ERROR_DESC" ("ABA0219_SB_CD_FILE_ERR_DESC") ENABLE;																																						
ALTER TABLE "MS9ABA"."ABA0227_SB_REDEMPTION" ADD CONSTRAINT "FK_ABA_277_233_BATCH_JOB_ID" FOREIGN KEY ("ABA0227_SB_BATCH_JOB_ID")																																							
	REFERENCES "MS9ABA"."ABA0233_SB_BATCH_JOB" ("ABA0233_SB_JOB_ID") ENABLE;																																						
ALTER TABLE "MS9ABA"."ABA0227_SB_REDEMPTION" ADD CONSTRAINT "FK_ABA_277_214_CD_FILE_TYPE" FOREIGN KEY ("ABA0227_SB_CD_FILE_TYPE")																																							
	REFERENCES "MS9ABA"."ABA0214_SB_CD_FILE_TYPE" ("ABA0214_SB_CD_FILE_TYPE") ENABLE;																																						
ALTER TABLE "MS9ABA"."ABA0227_SB_REDEMPTION" ADD CONSTRAINT "FK_ABA_277_222_ORG_ID" FOREIGN KEY ("ABA0227_SB_ORG_ID")																																							
	REFERENCES "MS9ABA"."ABA0222_SB_ORG" ("ABA0222_SB_ORG_ID") ENABLE;																																						
ALTER TABLE "MS9ABA"."ABA0227_SB_REDEMPTION" ADD CONSTRAINT "FK_ABA_277_215_CD_FILE_STATUS" FOREIGN KEY ("ABA0227_SB_CD_FILE_STATUS")																																							
	REFERENCES "MS9ABA"."ABA0215_SB_CD_FILE_STATUS" ("ABA0215_SB_CD_FILE_STATUS") ENABLE;																																						
--------------------------------------------------------																																							
--  Ref Constraints for Table ABA0228_SB_REDEMPTION_DT																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0228_SB_REDEMPTION_DT" ADD CONSTRAINT "FK_ABA_228_223_APPLICANT_ID" FOREIGN KEY ("ABA0228_SB_APPLICANT_ID")																																							
	REFERENCES "MS9ABA"."ABA0223_SB_APPLICANT" ("ABA0223_SB_APPLICANT_ID") ENABLE;																																						
ALTER TABLE "MS9ABA"."ABA0228_SB_REDEMPTION_DT" ADD CONSTRAINT "FK_ABA_228_227_REDEM_ID" FOREIGN KEY ("ABA0228_SB_REDEM_ID")																																							
	REFERENCES "MS9ABA"."ABA0227_SB_REDEMPTION" ("ABA0227_SB_REDEM_ID") ENABLE;																																						
ALTER TABLE "MS9ABA"."ABA0228_SB_REDEMPTION_DT" ADD CONSTRAINT "FK_ABA_228_222_ORG_ID" FOREIGN KEY ("ABA0228_SB_ORG_ID")																																							
	REFERENCES "MS9ABA"."ABA0222_SB_ORG" ("ABA0222_SB_ORG_ID") ENABLE;																																						
ALTER TABLE "MS9ABA"."ABA0228_SB_REDEMPTION_DT" ADD CONSTRAINT "FK_ABA_228_240_CD_SUB_TYPE" FOREIGN KEY ("ABA0228_SB_SUB_METHOD")																																							
	REFERENCES "MS9ABA"."ABA0240_SB_CD_SUBMISSION_TYPE" ("ABA0240_SB_CD_SUBMIT_TYPE") ENABLE;																																						
ALTER TABLE "MS9ABA"."ABA0228_SB_REDEMPTION_DT" ADD CONSTRAINT "FK_ABA_228_216_CD_RD_STATUS" FOREIGN KEY ("ABA0228_SB_CD_RECORD_STATUS")																																							
	REFERENCES "MS9ABA"."ABA0216_SB_CD_RECORD_STATUS" ("ABA0216_SB_CD_RECORD_STATUS") ENABLE;																																						
--------------------------------------------------------																																							
--  Ref Constraints for Table ABA0229_SB_REDEMPTION_DT_ERR																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0229_SB_REDEMPTION_DT_ERR" ADD CONSTRAINT "FK_ED39FR4G784GAHCOIX3E5I71G" FOREIGN KEY ("ABA0229_SB_CD_RECORD_ERR_DESC")																																							
	REFERENCES "MS9ABA"."ABA0220_SB_CD_RECORD_ERR_DESC" ("ABA0220_SB_CD_RECORD_ERR_DESC") ENABLE;																																						
ALTER TABLE "MS9ABA"."ABA0229_SB_REDEMPTION_DT_ERR" ADD CONSTRAINT "FK_SUDIBVA8DIUMEQ9WKOFPF9MMK" FOREIGN KEY ("ABA0229_SB_REDEM_ID")																																							
	REFERENCES "MS9ABA"."ABA0227_SB_REDEMPTION" ("ABA0227_SB_REDEM_ID") ENABLE;																																						
--------------------------------------------------------																																							
--  Ref Constraints for Table ABA0230_SB_HLD_INFO																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0230_SB_HLD_INFO" ADD CONSTRAINT "FK_ABA_230_233_BATCH_JOB_ID" FOREIGN KEY ("ABA0230_SB_BATCH_JOB_ID")																																							
	REFERENCES "MS9ABA"."ABA0233_SB_BATCH_JOB" ("ABA0233_SB_JOB_ID") ENABLE;																																						
ALTER TABLE "MS9ABA"."ABA0230_SB_HLD_INFO" ADD CONSTRAINT "FK_ABA_230_219_CD_FILE_ERR_DES" FOREIGN KEY ("ABA0230_SB_CD_FILE_ERR_DESC")																																							
	REFERENCES "MS9ABA"."ABA0219_SB_CD_FILE_ERROR_DESC" ("ABA0219_SB_CD_FILE_ERR_DESC") ENABLE;																																						
ALTER TABLE "MS9ABA"."ABA0230_SB_HLD_INFO" ADD CONSTRAINT "FK_ABA_230_222_ORG_ID" FOREIGN KEY ("ABA0230_SB_ORG_ID")																																							
	REFERENCES "MS9ABA"."ABA0222_SB_ORG" ("ABA0222_SB_ORG_ID") ENABLE;																																						
ALTER TABLE "MS9ABA"."ABA0230_SB_HLD_INFO" ADD CONSTRAINT "FK_ABA_230_215_CD_FILE_STATUS" FOREIGN KEY ("ABA0230_SB_CD_FILE_STATUS")																																							
	REFERENCES "MS9ABA"."ABA0215_SB_CD_FILE_STATUS" ("ABA0215_SB_CD_FILE_STATUS") ENABLE;																																						
ALTER TABLE "MS9ABA"."ABA0230_SB_HLD_INFO" ADD CONSTRAINT "FK_ABA_230_214_CD_FILE_TYPE" FOREIGN KEY ("ABA0230_SB_CD_FILE_TYPE")																																							
	REFERENCES "MS9ABA"."ABA0214_SB_CD_FILE_TYPE" ("ABA0214_SB_CD_FILE_TYPE") ENABLE;																																						
--------------------------------------------------------																																							
--  Ref Constraints for Table ABA0231_SB_HLD_INFO_DT																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0231_SB_HLD_INFO_DT" ADD CONSTRAINT "FK_ABA_231_230_HLD_INFO_ID" FOREIGN KEY ("ABA0231_SB_HLD_INFO_ID")																																							
	REFERENCES "MS9ABA"."ABA0230_SB_HLD_INFO" ("ABA0230_SB_HLD_INFO_ID") ENABLE;																																						
ALTER TABLE "MS9ABA"."ABA0231_SB_HLD_INFO_DT" ADD CONSTRAINT "FK_ABA_231_223_APPLICANT_ID" FOREIGN KEY ("ABA0231_SB_APPLICANT_ID")																																							
	REFERENCES "MS9ABA"."ABA0223_SB_APPLICANT" ("ABA0223_SB_APPLICANT_ID") ENABLE;																																						
--------------------------------------------------------																																							
--  Ref Constraints for Table ABA0232_SB_ALLOTMENT_RESULT																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0232_SB_ALLOTMENT_RESULT" ADD CONSTRAINT "FK_ABA_232_216_CD_RD_STATUS" FOREIGN KEY ("ABA0232_SB_CD_RECORD_STATUS")																																							
	REFERENCES "MS9ABA"."ABA0216_SB_CD_RECORD_STATUS" ("ABA0216_SB_CD_RECORD_STATUS") ENABLE;																																						
ALTER TABLE "MS9ABA"."ABA0232_SB_ALLOTMENT_RESULT" ADD CONSTRAINT "FK_ABA_232_225_SUB_DETAIL_ID" FOREIGN KEY ("ABA0232_SB_SUB_DETAIL_ID")																																							
	REFERENCES "MS9ABA"."ABA0225_SB_SUBSCRIPT_DT" ("ABA0225_SB_SUB_DETAIL_ID") ENABLE;																																						
ALTER TABLE "MS9ABA"."ABA0232_SB_ALLOTMENT_RESULT" ADD CONSTRAINT "FK_ABA_232_233_BATCH_JOB_ID" FOREIGN KEY ("ABA0232_SB_BATCH_JOB_ID")																																							
	REFERENCES "MS9ABA"."ABA0233_SB_BATCH_JOB" ("ABA0233_SB_JOB_ID") ENABLE;																																						
ALTER TABLE "MS9ABA"."ABA0232_SB_ALLOTMENT_RESULT" ADD CONSTRAINT "FK_ABA_232_220_CODE_RD_ERR_DES" FOREIGN KEY ("ABA0232_SB_CD_RECORD_ERR_DESC")																																							
	REFERENCES "MS9ABA"."ABA0220_SB_CD_RECORD_ERR_DESC" ("ABA0220_SB_CD_RECORD_ERR_DESC") ENABLE;																																						
--------------------------------------------------------																																							
--  Ref Constraints for Table ABA0235_SB_SUBMISSION_SUMMARY																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0235_SB_SUBMISSION_SUMMARY" ADD CONSTRAINT "FK_ABA_235_233_BATCH_JOB_ID" FOREIGN KEY ("ABA0235_SB_JOB_ID")																																							
	REFERENCES "MS9ABA"."ABA0233_SB_BATCH_JOB" ("ABA0233_SB_JOB_ID") ENABLE;																																						
ALTER TABLE "MS9ABA"."ABA0235_SB_SUBMISSION_SUMMARY" ADD CONSTRAINT "FK_ABA_235_214_CD_FILE_TYPE" FOREIGN KEY ("ABA0235_SB_CD_FILE_TYPE")																																							
	REFERENCES "MS9ABA"."ABA0214_SB_CD_FILE_TYPE" ("ABA0214_SB_CD_FILE_TYPE") ENABLE;																																						
ALTER TABLE "MS9ABA"."ABA0235_SB_SUBMISSION_SUMMARY" ADD CONSTRAINT "FK_ABA_235_222_ORG_ID" FOREIGN KEY ("ABA0235_SB_ORG_ID")																																							
	REFERENCES "MS9ABA"."ABA0222_SB_ORG" ("ABA0222_SB_ORG_ID") ENABLE;																																						
--------------------------------------------------------																																							
--  Ref Constraints for Table ABA0236_SB_HLD_INFO_DT_ERR																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0236_SB_HLD_INFO_DT_ERR" ADD CONSTRAINT "FK_M66S11SNM82H14ORVIRKCXN55" FOREIGN KEY ("ABA0236_SB_HLD_INFO_ID")																																							
	REFERENCES "MS9ABA"."ABA0230_SB_HLD_INFO" ("ABA0230_SB_HLD_INFO_ID") ENABLE;																																						
ALTER TABLE "MS9ABA"."ABA0236_SB_HLD_INFO_DT_ERR" ADD CONSTRAINT "FK_62J0Q6N9Y5D5V3RNF93ESOKAM" FOREIGN KEY ("ABA0236_SB_CD_RECORD_ERR_DESC")																																							
	REFERENCES "MS9ABA"."ABA0220_SB_CD_RECORD_ERR_DESC" ("ABA0220_SB_CD_RECORD_ERR_DESC") ENABLE;																																						
--------------------------------------------------------																																							
--  Ref Constraints for Table BATCH_JOB_EXECUTION																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."BATCH_JOB_EXECUTION" ADD CONSTRAINT "JOB_INST_EXEC_FK" FOREIGN KEY ("JOB_INSTANCE_ID")																																							
	REFERENCES "MS9ABA"."BATCH_JOB_INSTANCE" ("JOB_INSTANCE_ID") ENABLE;																																						
--------------------------------------------------------																																							
--  Ref Constraints for Table BATCH_JOB_EXECUTION_CONTEXT																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."BATCH_JOB_EXECUTION_CONTEXT" ADD CONSTRAINT "JOB_EXEC_CTX_FK" FOREIGN KEY ("JOB_EXECUTION_ID")																																							
	REFERENCES "MS9ABA"."BATCH_JOB_EXECUTION" ("JOB_EXECUTION_ID") ENABLE;																																						
--------------------------------------------------------																																							
--  Ref Constraints for Table BATCH_JOB_EXECUTION_PARAMS																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."BATCH_JOB_EXECUTION_PARAMS" ADD CONSTRAINT "JOB_EXEC_PARAMS_FK" FOREIGN KEY ("JOB_EXECUTION_ID")																																							
	REFERENCES "MS9ABA"."BATCH_JOB_EXECUTION" ("JOB_EXECUTION_ID") ENABLE;																																						
--------------------------------------------------------																																							
--  Ref Constraints for Table BATCH_STEP_EXECUTION																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."BATCH_STEP_EXECUTION" ADD CONSTRAINT "JOB_EXEC_STEP_FK" FOREIGN KEY ("JOB_EXECUTION_ID")																																							
	REFERENCES "MS9ABA"."BATCH_JOB_EXECUTION" ("JOB_EXECUTION_ID") ENABLE;																																						
--------------------------------------------------------																																							
--  Ref Constraints for Table BATCH_STEP_EXECUTION_CONTEXT																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."BATCH_STEP_EXECUTION_CONTEXT" ADD CONSTRAINT "STEP_EXEC_CTX_FK" FOREIGN KEY ("STEP_EXECUTION_ID")																																							
	REFERENCES "MS9ABA"."BATCH_STEP_EXECUTION" ("STEP_EXECUTION_ID") ENABLE;																																						
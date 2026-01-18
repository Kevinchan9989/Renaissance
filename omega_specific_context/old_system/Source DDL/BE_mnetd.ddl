--------------------------------------------------------																																							
--  File created - Tuesday-September-23-2025																																							
--------------------------------------------------------																																							
--------------------------------------------------------																																							
--  DDL for Sequence ABA0027_BATCH_JOB_SEQ																																							
--------------------------------------------------------																																							
																																							
CREATE SEQUENCE  "MS9ABA"."ABA0027_BATCH_JOB_SEQ"  MINVALUE 1 MAXVALUE 9999999999999999999999999999 INCREMENT BY 1 START WITH 11876 CACHE 20 NOORDER  NOCYCLE  NOKEEP  NOSCALE  GLOBAL ;																																							
--------------------------------------------------------																																							
--  DDL for Sequence ABA0028_BATCH_JOB_EXE_SEQ																																							
--------------------------------------------------------																																							
																																							
CREATE SEQUENCE  "MS9ABA"."ABA0028_BATCH_JOB_EXE_SEQ"  MINVALUE 1 MAXVALUE 9999999999999999999999999999 INCREMENT BY 1 START WITH 59187 CACHE 20 NOORDER  NOCYCLE  NOKEEP  NOSCALE  GLOBAL ;																																							
--------------------------------------------------------																																							
--  DDL for Sequence ERF_TRANS_REF_NO																																							
--------------------------------------------------------																																							
																																							
CREATE SEQUENCE  "MS9ABA"."ERF_TRANS_REF_NO"  MINVALUE 1 MAXVALUE 999999 INCREMENT BY 1 START WITH 1787 NOCACHE  NOORDER  NOCYCLE  NOKEEP  NOSCALE  GLOBAL ;																																							
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
																																							
CREATE SEQUENCE  "MS9ABA"."TRANS_REF_NO"  MINVALUE 1 MAXVALUE 99999999 INCREMENT BY 1 START WITH 640 NOCACHE  NOORDER  NOCYCLE  NOKEEP  NOSCALE  GLOBAL ;																																							
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
	ABA0001_INT_PAID_IND CHAR(1 BYTE) DEFAULT NULL,																																						
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
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table ABA0001_SECURITY_MASTER_20230428																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."ABA0001_SECURITY_MASTER_20230428"																																							
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
	ABA0001_QTY_APP_COMP NUMBER(13,0),																																						
	ABA0001_QTY_APP_NONCOMP NUMBER(13,0),																																						
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
TABLESPACE "NETAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table ABA0001_SECURITY_MASTER_20230512																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."ABA0001_SECURITY_MASTER_20230512"																																							
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
TABLESPACE "NETAPP" ;																																							
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
TABLESPACE "NETAPP" ;																																							
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
TABLESPACE "NETAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table ABA0001_SECURITY_MASTER_20230529																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."ABA0001_SECURITY_MASTER_20230529"																																							
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
TABLESPACE "NETAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table ABA0001_SECURITY_MASTER_20230601																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."ABA0001_SECURITY_MASTER_20230601"																																							
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
TABLESPACE "NETAPP" ;																																							
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
TABLESPACE "NETAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table ABA0001_SECURITY_MASTER_T																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."ABA0001_SECURITY_MASTER_T"																																							
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
TABLESPACE "NETAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table ABA0002_FRN_ISSUE																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."ABA0002_FRN_ISSUE"																																							
(	ABA0002_SECURITY_CODE CHAR(8 BYTE),																																						
	ABA0002_ISSUE_NO CHAR(1 BYTE),																																						
	ABA0002_FIRST_CPN_DATE DATE																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table ABA0004_RETAIL_BID_TRANS																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."ABA0004_RETAIL_BID_TRANS"																																							
(	ABA0004_SECURITY_CODE CHAR(8 BYTE),																																						
	ABA0004_ISSUE_NO CHAR(1 BYTE),																																						
	ABA0004_BANK_REF_NO VARCHAR2(12 BYTE),																																						
	ABA0004_FORM_NO NUMBER(6,0),																																						
	ABA0004_RECEIVED_DATE DATE DEFAULT SYSDATE,																																						
	ABA0004_RECEIVED_TIME DATE DEFAULT SYSDATE,																																						
	ABA0004_SUBMISSION_METHOD CHAR(1 BYTE) DEFAULT 'E',																																						
	ABA0004_SUBMITTED_BY VARCHAR2(20 BYTE),																																						
	ABA0004_FILE_TYPE VARCHAR2(3 BYTE) DEFAULT 'AP1'																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 10485760 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table ABA0004_RETAIL_BID_TRANS_20230428																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."ABA0004_RETAIL_BID_TRANS_20230428"																																							
(	ABA0004_SECURITY_CODE CHAR(8 BYTE),																																						
	ABA0004_ISSUE_NO CHAR(1 BYTE),																																						
	ABA0004_BANK_REF_NO VARCHAR2(12 BYTE),																																						
	ABA0004_FORM_NO NUMBER(6,0),																																						
	ABA0004_RECEIVED_DATE DATE,																																						
	ABA0004_RECEIVED_TIME DATE,																																						
	ABA0004_SUBMISSION_METHOD CHAR(1 BYTE),																																						
	ABA0004_SUBMITTED_BY VARCHAR2(20 BYTE),																																						
	ABA0004_FILE_TYPE VARCHAR2(3 BYTE)																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table ABA0004_RETAIL_BID_TRANS_BKP																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."ABA0004_RETAIL_BID_TRANS_BKP"																																							
(	ABA0004_SECURITY_CODE CHAR(8 BYTE),																																						
	ABA0004_ISSUE_NO CHAR(1 BYTE),																																						
	ABA0004_BANK_REF_NO VARCHAR2(12 BYTE),																																						
	ABA0004_FORM_NO NUMBER(6,0),																																						
	ABA0004_RECEIVED_DATE DATE DEFAULT SYSDATE,																																						
	ABA0004_RECEIVED_TIME DATE DEFAULT SYSDATE,																																						
	ABA0004_SUBMISSION_METHOD CHAR(1 BYTE) DEFAULT 'E',																																						
	ABA0004_SUBMITTED_BY VARCHAR2(20 BYTE),																																						
	ABA0004_FILE_TYPE VARCHAR2(3 BYTE) DEFAULT 'AP1'																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 10485760 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table ABA0005_RSA_TEXT_ENC_TRANS																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."ABA0005_RSA_TEXT_ENC_TRANS"																																							
(	ABA0005_SECURITY_CODE CHAR(8 BYTE),																																						
	ABA0005_ISSUE_NO CHAR(1 BYTE),																																						
	ABA0005_BANK_REF_NO VARCHAR2(12 BYTE),																																						
	ABA0005_REF_NO VARCHAR2(5 BYTE),																																						
	ABA0005_ENCRYPTED_DATA1 VARCHAR2(600 BYTE),																																						
	ABA0005_ENCRYPTED_DATA2 VARCHAR2(600 BYTE),																																						
	ABA0005_ENCRYPTED_DATA3 VARCHAR2(600 BYTE),																																						
	ABA0005_ENCRYPTED_DATA4 VARCHAR2(600 BYTE),																																						
	ABA0005_DATA_CHECKSUM VARCHAR2(300 BYTE),																																						
	ABA0005_RECEIVED_DATE DATE DEFAULT SYSDATE,																																						
	ABA0005_RECEIVED_TIME DATE DEFAULT SYSDATE,																																						
	ABA0005_SUBMISSION_METHOD CHAR(1 BYTE) DEFAULT 'E',																																						
	ABA0005_WITHDRAWN_TIME DATE,																																						
	ABA0005_WITHDRAWN_BY VARCHAR2(8 BYTE),																																						
	ABA0005_SUBMITTED_BY VARCHAR2(8 BYTE)																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 10485760 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table ABA0005_RSA_TEXT_ENC_TRANS_20230428																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."ABA0005_RSA_TEXT_ENC_TRANS_20230428"																																							
(	ABA0005_SECURITY_CODE CHAR(8 BYTE),																																						
	ABA0005_ISSUE_NO VARCHAR2(3 BYTE),																																						
	ABA0005_BANK_REF_NO VARCHAR2(12 BYTE),																																						
	ABA0005_REF_NO VARCHAR2(5 BYTE),																																						
	ABA0005_ENCRYPTED_DATA1 VARCHAR2(600 BYTE),																																						
	ABA0005_ENCRYPTED_DATA2 VARCHAR2(600 BYTE),																																						
	ABA0005_ENCRYPTED_DATA3 VARCHAR2(600 BYTE),																																						
	ABA0005_ENCRYPTED_DATA4 VARCHAR2(600 BYTE),																																						
	ABA0005_DATA_CHECKSUM VARCHAR2(300 BYTE),																																						
	ABA0005_RECEIVED_DATE DATE,																																						
	ABA0005_RECEIVED_TIME DATE,																																						
	ABA0005_SUBMISSION_METHOD CHAR(1 BYTE),																																						
	ABA0005_WITHDRAWN_TIME DATE,																																						
	ABA0005_WITHDRAWN_BY VARCHAR2(8 BYTE),																																						
	ABA0005_SUBMITTED_BY VARCHAR2(8 BYTE)																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP" ;																																							
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
STORAGE(INITIAL 3145728 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table ABA0006_AUCTION_RESULT_20230428																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."ABA0006_AUCTION_RESULT_20230428"																																							
(	ABA0006_SECURITY_CODE CHAR(8 BYTE),																																						
	ABA0006_ISSUE_NO VARCHAR2(3 BYTE),																																						
	ABA0006_BANK_ACC_CODE NUMBER(4,0),																																						
	ABA0006_TENDER_DATE DATE,																																						
	ABA0006_LINE_NO NUMBER(9,0),																																						
	ABA0006_LINE_CONTENT VARCHAR2(200 BYTE),																																						
	ABA0006_UPDATE_TIME DATE																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP" ;																																							
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
STORAGE(INITIAL 2097152 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table ABA0007_DETAIL_AUCTION_RESULT_20230428																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."ABA0007_DETAIL_AUCTION_RESULT_20230428"																																							
(	ABA0007_SECURITY_CODE VARCHAR2(8 BYTE),																																						
	ABA0007_ISSUE_NO VARCHAR2(3 BYTE),																																						
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
	ABA0007_APPLIED_AMT NUMBER(16,0),																																						
	ABA0007_ALLOTED_AMT NUMBER(16,0),																																						
	ABA0007_SETTLEMENT_AMT NUMBER(18,2),																																						
	ABA0007_ACCRUED_INT NUMBER(18,2),																																						
	ABA0007_CUST_BANK_CODE NUMBER(4,0),																																						
	ABA0007_CUST_BANK_BC VARCHAR2(1 BYTE),																																						
	ABA0007_TYPE_OF_APPLN VARCHAR2(3 BYTE),																																						
	ABA0007_CDP_ACC_NO VARCHAR2(16 BYTE),																																						
	ABA0007_SUB_MTD CHAR(1 BYTE),																																						
	ABA0007_UPDATED_DATETIME DATE,																																						
	ABA0007_CPF_ACNO CHAR(16 BYTE),																																						
	ABA0007_FILE_TYPE VARCHAR2(3 BYTE)																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table ABA0008_STAGE_SECURITY_MASTER																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."ABA0008_STAGE_SECURITY_MASTER"																																							
(	ABA0008_SECURITY_CODE CHAR(8 BYTE),																																						
	ABA0008_ISSUE_NO CHAR(1 BYTE),																																						
	ABA0008_ISSUE_TYPE CHAR(1 BYTE),																																						
	ABA0008_CURR CHAR(3 BYTE),																																						
	ABA0008_SECURITY_NAME VARCHAR2(30 BYTE),																																						
	ABA0008_ISSUE_DATE DATE,																																						
	ABA0008_TENDER_DATE DATE,																																						
	ABA0008_ISSUE_SIZE NUMBER(13,0),																																						
	ABA0008_QTY_APPLIED NUMBER(13,0),																																						
	ABA0008_AVE_YIELD NUMBER(5,2),																																						
	ABA0008_CUTOFF_YIELD NUMBER(5,2),																																						
	ABA0008_MATURITY_DATE DATE,																																						
	ABA0008_PERCENT_COY NUMBER(5,2),																																						
	ABA0008_PERCENT_SUB NUMBER(5,2),																																						
	ABA0008_INTEREST_RATE NUMBER(7,4),																																						
	ABA0008_TAX_STATUS CHAR(1 BYTE),																																						
	ABA0008_AVE_PRICE NUMBER(7,4),																																						
	ABA0008_COY_PRICE NUMBER(7,4),																																						
	ABA0008_CLOSING_PRICE NUMBER(7,4),																																						
	ABA0008_REFERENCE_NO NUMBER(5,0),																																						
	ABA0008_ISIN_CODE CHAR(12 BYTE),																																						
	ABA0008_ANNOUNCE_DATE DATE,																																						
	ABA0008_RESULT_LOAD_DATE DATE,																																						
	ABA0008_LAST_INT_DATE DATE,																																						
	ABA0008_NEXT_INT_DATE DATE,																																						
	ABA0008_ACCRUED_INT_DAYS NUMBER(3,0),																																						
	ABA0008_INT_DATE1 DATE,																																						
	ABA0008_INT_DATE2 DATE,																																						
	ABA0008_INT_PAID_IND CHAR(1 BYTE) DEFAULT 'N',																																						
	ABA0008_TENOR NUMBER(3,0),																																						
	ABA0008_ETENDER_IND CHAR(1 BYTE) DEFAULT 'Y',																																						
	ABA0008_MAS_APPLIED NUMBER(13,0),																																						
	ABA0008_MAS_ALLOTTED NUMBER(13,0),																																						
	ABA0008_NC_PERCENT NUMBER(5,2),																																						
	ABA0008_NC_QTY_ALLOT NUMBER(13,0),																																						
	ABA0008_EX_INT_DATE DATE,																																						
	ABA0008_QTY_APP_COMP NUMBER(13,0),																																						
	ABA0008_QTY_APP_NONCOMP NUMBER(13,0),																																						
	ABA0008_ACCRUED_INT NUMBER(7,4) DEFAULT 0,																																						
	ABA0008_ANNOUNCE_INDICATOR CHAR(1 BYTE) DEFAULT 'N',																																						
	ABA0008_CPN_PAYM_IND CHAR(1 BYTE)																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table ABA0009_BANK_MASTER																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."ABA0009_BANK_MASTER"																																							
(	ABA0009_BANK_CODE CHAR(4 BYTE),																																						
	ABA0009_BANK_NAME VARCHAR2(40 BYTE),																																						
	ABA0009_BANK_SHORTNAME VARCHAR2(15 BYTE),																																						
	ABA0009_AUTODEBIT_INDICATOR CHAR(1 BYTE),																																						
	ABA0009_PARTICIPANT_INDICATOR CHAR(1 BYTE) DEFAULT 'Y'																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table ABA0009_BANK_MASTER_BKUP																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."ABA0009_BANK_MASTER_BKUP"																																							
(	ABA0009_BANK_CODE CHAR(4 BYTE),																																						
	ABA0009_BANK_NAME VARCHAR2(40 BYTE),																																						
	ABA0009_BANK_SHORTNAME VARCHAR2(15 BYTE),																																						
	ABA0009_AUTODEBIT_INDICATOR CHAR(1 BYTE),																																						
	ABA0009_PARTICIPANT_INDICATOR CHAR(1 BYTE)																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table ABA0009_BANK_MASTER_BKUP1																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."ABA0009_BANK_MASTER_BKUP1"																																							
(	ABA0009_BANK_CODE CHAR(4 BYTE),																																						
	ABA0009_BANK_NAME VARCHAR2(40 BYTE),																																						
	ABA0009_BANK_SHORTNAME VARCHAR2(15 BYTE),																																						
	ABA0009_AUTODEBIT_INDICATOR CHAR(1 BYTE),																																						
	ABA0009_PARTICIPANT_INDICATOR CHAR(1 BYTE)																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table ABA0009_BANK_MASTER_BKUP2																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."ABA0009_BANK_MASTER_BKUP2"																																							
(	ABA0009_BANK_CODE CHAR(4 BYTE),																																						
	ABA0009_BANK_NAME VARCHAR2(40 BYTE),																																						
	ABA0009_BANK_SHORTNAME VARCHAR2(15 BYTE),																																						
	ABA0009_AUTODEBIT_INDICATOR CHAR(1 BYTE),																																						
	ABA0009_PARTICIPANT_INDICATOR CHAR(1 BYTE)																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table ABA0009_BANK_MASTER_BKUP3																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."ABA0009_BANK_MASTER_BKUP3"																																							
(	ABA0009_BANK_CODE CHAR(4 BYTE),																																						
	ABA0009_BANK_NAME VARCHAR2(40 BYTE),																																						
	ABA0009_BANK_SHORTNAME VARCHAR2(15 BYTE),																																						
	ABA0009_AUTODEBIT_INDICATOR CHAR(1 BYTE),																																						
	ABA0009_PARTICIPANT_INDICATOR CHAR(1 BYTE)																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table ABA0009_BANK_MASTER_BKUP4																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."ABA0009_BANK_MASTER_BKUP4"																																							
(	ABA0009_BANK_CODE CHAR(4 BYTE),																																						
	ABA0009_BANK_NAME VARCHAR2(40 BYTE),																																						
	ABA0009_BANK_SHORTNAME VARCHAR2(15 BYTE),																																						
	ABA0009_AUTODEBIT_INDICATOR CHAR(1 BYTE),																																						
	ABA0009_PARTICIPANT_INDICATOR CHAR(1 BYTE)																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table ABA0010_ANNOUNCE_TEXT																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."ABA0010_ANNOUNCE_TEXT"																																							
(	ABA0010_NAME VARCHAR2(8 BYTE),																																						
	ABA0010_USED_BEFORE DATE DEFAULT '01/JAN/2099',																																						
	ABA0010_TEXT VARCHAR2(4000 BYTE),																																						
	ABA0010_LAST_UPDATED DATE DEFAULT SYSDATE																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table ABA0011_DAILY_PRICE																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."ABA0011_DAILY_PRICE"																																							
(	ABA0011_SECURITY_CODE CHAR(8 BYTE),																																						
	ABA0011_ISSUE_NO CHAR(1 BYTE),																																						
	ABA0011_BANK_ACC_CODE NUMBER(4,0),																																						
	ABA0011_SUBMISSION_DATE DATE,																																						
	ABA0011_BID_PRICE NUMBER(7,4) DEFAULT 0,																																						
	ABA0011_OFFER_PRICE NUMBER(7,4) DEFAULT 0,																																						
	ABA0011_HIGH_PRICE NUMBER(7,4) DEFAULT 0,																																						
	ABA0011_LOW_PRICE NUMBER(7,4) DEFAULT 0,																																						
	ABA0011_VOLUME NUMBER(13,0) DEFAULT 0,																																						
	ABA0011_UPDATE_TIME DATE DEFAULT SYSDATE,																																						
	ABA0011_BENCH_PRICE_FLAG VARCHAR2(1 BYTE)																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 7340032 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table ABA0012_DP_STATUS																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."ABA0012_DP_STATUS"																																							
(	ABA0012_BANK_ACC_CODE NUMBER(4,0),																																						
	ABA0012_SUBMISSION_DATE DATE,																																						
	ABA0012_ALLOW_EDIT_IND CHAR(1 BYTE) DEFAULT 'N',																																						
	ABA0012_UPDATE_TIME DATE DEFAULT SYSDATE,																																						
	ABA0012_USERID VARCHAR2(8 BYTE)																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table ABA0013_PRIMARY_DEALER																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."ABA0013_PRIMARY_DEALER"																																							
(	ABA0013_BANK_CODE CHAR(4 BYTE),																																						
	ABA0013_BANK_NAME VARCHAR2(40 BYTE),																																						
	ABA0013_BANK_SHORTNAME VARCHAR2(15 BYTE),																																						
	ABA0013_MASREPO_IND CHAR(1 BYTE) DEFAULT 'Y'																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table ABA0015_PRICE_SPREAD																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."ABA0015_PRICE_SPREAD"																																							
(	ABA0015_TYPE NUMBER(2,0),																																						
	ABA0015_CHECK_1 NUMBER(3,2),																																						
	ABA0015_CHECK_2 NUMBER(3,2),																																						
	ABA0015_CHECK_3 NUMBER(3,2),																																						
	ABA0015_CHECK_4 NUMBER(3,2),																																						
	ABA0015_CHECK_5 NUMBER(3,2),																																						
	ABA0015_CHECK_6 NUMBER(3,2)																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table ABA0016_DAILY_EXTRA_DATA																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."ABA0016_DAILY_EXTRA_DATA"																																							
(	ABA0016_BANK_ACC_CODE NUMBER(4,0),																																						
	ABA0016_SUBMISSION_DATE DATE,																																						
	ABA0016_REPO_BID_PRICE NUMBER(7,4) DEFAULT 0,																																						
	ABA0016_REPO_OFFER_PRICE NUMBER(7,4) DEFAULT 0,																																						
	ABA0016_COMM_BID_PRICE NUMBER(7,4) DEFAULT 0,																																						
	ABA0016_COMM_OFFER_PRICE NUMBER(7,4) DEFAULT 0,																																						
	ABA0016_UPDATE_TIME DATE DEFAULT SYSDATE																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table ABA0017_FINAL_DAILY_PRICE																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."ABA0017_FINAL_DAILY_PRICE"																																							
(	ABA0017_SECURITY_CODE CHAR(8 BYTE),																																						
	ABA0017_ISSUE_NO CHAR(1 BYTE),																																						
	ABA0017_SUBMISSION_DATE DATE,																																						
	ABA0017_HIGH_PRICE NUMBER(7,4) DEFAULT 0,																																						
	ABA0017_LOW_PRICE NUMBER(7,4) DEFAULT 0,																																						
	ABA0017_AVE_PRICE NUMBER(7,4) DEFAULT 0,																																						
	ABA0017_DIRTY_PRICE NUMBER(7,4) DEFAULT 0,																																						
	ABA0017_MLA_PRICE NUMBER(7,4) DEFAULT 0,																																						
	ABA0017_YIELD NUMBER(7,4) DEFAULT 0,																																						
	ABA0017_UPDATE_TIME DATE DEFAULT SYSDATE,																																						
	ABA0017_T1_DATE DATE,																																						
	ABA0017_T1_DIRTY_PRICE NUMBER(7,4) DEFAULT 0,																																						
	ABA0017_REPOT1_DATE DATE,																																						
	ABA0017_REPOT1_DIRTY_PRICE NUMBER(7,4) DEFAULT 0,																																						
	ABA0017_T2_DATE DATE,																																						
	ABA0017_REPOT2_DATE DATE,																																						
	ABA0017_REPOT2_DIRTY_PRICE NUMBER(7,4) DEFAULT 0,																																						
	ABA0017_BENCH_HIGH_PRICE NUMBER(7,4) DEFAULT 0,																																						
	ABA0017_BENCH_LOW_PRICE NUMBER(7,4) DEFAULT 0,																																						
	ABA0017_MODIFIED_DURATION NUMBER(8,4) DEFAULT 0,																																						
	ABA0017_BENCH_PRICE_FLAG VARCHAR2(1 BYTE),																																						
	ABA0017_T3_DATE_NON_US DATE,																																						
	ABA0017_T3_DIRTY_PRICE_NON_US NUMBER(7,4) DEFAULT 0																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 12582912 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table ABA0018_FINAL_EXTRA_PRICE																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."ABA0018_FINAL_EXTRA_PRICE"																																							
(	ABA0018_SECURITY_TYPE CHAR(4 BYTE),																																						
	ABA0018_SUBMISSION_DATE DATE,																																						
	ABA0018_HIGH_PRICE NUMBER(7,4) DEFAULT 0,																																						
	ABA0018_LOW_PRICE NUMBER(7,4) DEFAULT 0,																																						
	ABA0018_AVE_PRICE NUMBER(7,4) DEFAULT 0,																																						
	ABA0018_UPDATE_TIME DATE DEFAULT SYSDATE																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table ABA0019_PUBLIC_HOLIDAY																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."ABA0019_PUBLIC_HOLIDAY"																																							
(	ABA0019_DATE DATE,																																						
	ABA0019_DESCRIPTION VARCHAR2(30 BYTE),																																						
	ABA0019_COUNTRY VARCHAR2(10 BYTE) DEFAULT 'SG',																																						
	ABA0019_UPDATE_TIME DATE DEFAULT SYSDATE																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table ABA0020_STAGING_BANK_MASTER																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."ABA0020_STAGING_BANK_MASTER"																																							
(	ABA0020_BANK_CODE CHAR(4 BYTE),																																						
	ABA0020_BANK_NAME VARCHAR2(40 BYTE),																																						
	ABA0020_BANK_SHORTNAME VARCHAR2(15 BYTE),																																						
	ABA0020_AUTODEBIT_INDICATOR CHAR(1 BYTE),																																						
	ABA0020_PARTICIPANT_INDICATOR CHAR(1 BYTE) DEFAULT 'Y'																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table ABA0021_ISSUE_CALENDAR																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."ABA0021_ISSUE_CALENDAR"																																							
(	ABA0021_SECURITY_CODE VARCHAR2(8 BYTE),																																						
	ABA0021_ISSUE_NO VARCHAR2(1 BYTE),																																						
	ABA0021_ISIN_CODE VARCHAR2(12 BYTE),																																						
	ABA0021_ISSUE_TYPE VARCHAR2(1 BYTE),																																						
	ABA0021_TENOR NUMBER(3,0),																																						
	ABA0021_TENOR_UNIT VARCHAR2(1 BYTE),																																						
	ABA0021_CURR VARCHAR2(3 BYTE),																																						
	ABA0021_NEW_REOPEN VARCHAR2(1 BYTE),																																						
	ABA0021_OPEN_DATETIME DATE,																																						
	ABA0021_CLOSE_DATETIME DATE,																																						
	ABA0021_ISSUE_DATETIME DATE,																																						
	ABA0021_FLAG VARCHAR2(1 BYTE),																																						
	ABA0021_PD_ISSUE_TYPE VARCHAR2(1 BYTE)																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table ABA0022_NON_BENCHMARK																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."ABA0022_NON_BENCHMARK"																																							
(	ABA0022_SECURITY_CODE CHAR(8 BYTE),																																						
	ABA0022_ISSUE_NO CHAR(1 BYTE),																																						
	ABA0022_UPDATE_TIME DATE																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table ABA0022_NON_BENCHMARK_20230428																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."ABA0022_NON_BENCHMARK_20230428"																																							
(	ABA0022_SECURITY_CODE CHAR(8 BYTE),																																						
	ABA0022_ISSUE_NO VARCHAR2(3 BYTE),																																						
	ABA0022_UPDATE_TIME DATE																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table ABA0023_AUDIT_ACTION																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."ABA0023_AUDIT_ACTION"																																							
(	ABA0023_MODULE VARCHAR2(20 BYTE),																																						
	ABA0023_ACTION VARCHAR2(50 BYTE),																																						
	ABA0023_USERID VARCHAR2(8 BYTE),																																						
	ABA0023_UPDATE_TIME DATE DEFAULT SYSDATE																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 2097152 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table ABA0024_USER_SESSION																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."ABA0024_USER_SESSION"																																							
(	ABA0024_USER_ID VARCHAR2(8 BYTE),																																						
	ABA0024_SESSION_ID VARCHAR2(200 BYTE),																																						
	ABA0024_LAST_LOGIN_DATE TIMESTAMP (6)																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 2097152 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table ABA0025_OUTSTANDING_SGS																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."ABA0025_OUTSTANDING_SGS"																																							
(	ABA0025_YEAR VARCHAR2(4 BYTE),																																						
	ABA0025_MONTH VARCHAR2(15 BYTE),																																						
	ABA0025_TBILL NUMBER(13,0) DEFAULT 0,																																						
	ABA0025_BOND NUMBER(13,0) DEFAULT 0,																																						
	ABA0025_INFRA NUMBER(13,0) DEFAULT 0,																																						
	ABA0025_GREEN_INFRA NUMBER(13,0) DEFAULT 0																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table ABA0026_OUTSTANDING_MAS																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."ABA0026_OUTSTANDING_MAS"																																							
(	ABA0026_YEAR VARCHAR2(4 BYTE),																																						
	ABA0026_MONTH VARCHAR2(15 BYTE),																																						
	ABA0026_WEEK4 NUMBER(13,0) DEFAULT 0,																																						
	ABA0026_WEEK8 NUMBER(13,0) DEFAULT 0,																																						
	ABA0026_WEEK12 NUMBER(13,0) DEFAULT 0,																																						
	ABA0026_WEEK24 NUMBER(13,0) DEFAULT 0,																																						
	ABA0026_OTH NUMBER(13,0) DEFAULT 0,																																						
	ABA0026_WEEK36 NUMBER(13,0) DEFAULT 0																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table ABA0027_BATCH_JOB																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."ABA0027_BATCH_JOB"																																							
(	ABA0027_JOB_ID NUMBER(19,0),																																						
	ABA0027_JOB_TYPE VARCHAR2(100 BYTE),																																						
	ABA0027_JOB_INSTANCE_ID NUMBER(19,0),																																						
	ABA0027_JOB_STATUS VARCHAR2(1 BYTE),																																						
	ABA0027_CREATED_DT DATE																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table ABA0028_BATCH_JOB_EXECUTION																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."ABA0028_BATCH_JOB_EXECUTION"																																							
(	ABA0028_JOB_EXECUTION_ID NUMBER(19,0),																																						
	ABA0028_JOB_ID NUMBER(19,0),																																						
	ABA0028_JOB_STEP NUMBER(10,0),																																						
	ABA0028_STEP_STATUS VARCHAR2(1 BYTE),																																						
	ABA0028_ORG_CODE NUMBER(4,0),																																						
	ABA0028_PROCESSED_RECORDS NUMBER(19,0),																																						
	ABA0028_REMARKS VARCHAR2(255 BYTE),																																						
	ABA0028_CREATED_DT TIMESTAMP (6) DEFAULT CURRENT_TIMESTAMP,																																						
	ABA0028_APPLICATION_TYPE VARCHAR2(20 BYTE)																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table ABA0029_SORA_RATE																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."ABA0029_SORA_RATE"																																							
(	ABA0029_SORA_PUB_DT DATE,																																						
	ABA0029_SORA_VALUE_DT DATE,																																						
	ABA0029_SORA_RATE NUMBER(7,4),																																						
	ABA0029_SORA_INDEX NUMBER(13,10),																																						
	ABA0029_COMP_SORA_1MTH NUMBER(7,4),																																						
	ABA0029_COMP_SORA_3MTH NUMBER(7,4),																																						
	ABA0029_COMP_SORA_6MTH NUMBER(7,4),																																						
	ABA0029_AGGREGATE_VOLUME NUMBER(5,0),																																						
	ABA0029_HIGH_TRANS_RATE NUMBER(7,4),																																						
	ABA0029_LOW_TRANS_RATE NUMBER(7,4),																																						
	ABA0029_CALCULATION_METHOD VARCHAR2(150 BYTE),																																						
	ABA0029_LAST_PUBLISHED_DT TIMESTAMP (6),																																						
	ABA0029_LAST_MODIFIED_DT TIMESTAMP (6) DEFAULT SYSDATE,																																						
	ABA0029_LAST_MODIFIED_BY VARCHAR2(8 BYTE)																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table ABA0029_SORA_RATE_20230427																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."ABA0029_SORA_RATE_20230427"																																							
(	ABA0029_SORA_PUB_DT DATE,																																						
	ABA0029_SORA_VALUE_DT DATE,																																						
	ABA0029_SORA_RATE NUMBER(7,4),																																						
	ABA0029_SORA_INDEX NUMBER(13,10),																																						
	ABA0029_COMP_SORA_1MTH NUMBER(7,4),																																						
	ABA0029_COMP_SORA_3MTH NUMBER(7,4),																																						
	ABA0029_COMP_SORA_6MTH NUMBER(7,4),																																						
	ABA0029_AGGREGATE_VOLUME NUMBER(5,0),																																						
	ABA0029_HIGH_TRANS_RATE NUMBER(7,4),																																						
	ABA0029_LOW_TRANS_RATE NUMBER(7,4),																																						
	ABA0029_CALCULATION_METHOD VARCHAR2(150 BYTE),																																						
	ABA0029_LAST_PUBLISHED_DT TIMESTAMP (6),																																						
	ABA0029_LAST_MODIFIED_DT TIMESTAMP (6),																																						
	ABA0029_LAST_MODIFIED_BY VARCHAR2(8 BYTE)																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table ABA0029_SORA_RATE_BKP_20220905																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."ABA0029_SORA_RATE_BKP_20220905"																																							
(	ABA0029_SORA_PUB_DT DATE,																																						
	ABA0029_SORA_VALUE_DT DATE,																																						
	ABA0029_SORA_RATE NUMBER(7,4),																																						
	ABA0029_SORA_INDEX NUMBER(13,10),																																						
	ABA0029_COMP_SORA_1MTH NUMBER(7,4),																																						
	ABA0029_COMP_SORA_3MTH NUMBER(7,4),																																						
	ABA0029_COMP_SORA_6MTH NUMBER(7,4),																																						
	ABA0029_AGGREGATE_VOLUME NUMBER(5,0),																																						
	ABA0029_HIGH_TRANS_RATE NUMBER(7,4),																																						
	ABA0029_LOW_TRANS_RATE NUMBER(7,4),																																						
	ABA0029_CALCULATION_METHOD VARCHAR2(150 BYTE),																																						
	ABA0029_LAST_PUBLISHED_DT TIMESTAMP (6),																																						
	ABA0029_LAST_MODIFIED_DT TIMESTAMP (6),																																						
	ABA0029_LAST_MODIFIED_BY VARCHAR2(8 BYTE)																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table ABA0029_SORA_RATE_BKUP																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."ABA0029_SORA_RATE_BKUP"																																							
(	ABA0029_SORA_PUB_DT DATE,																																						
	ABA0029_SORA_VALUE_DT DATE,																																						
	ABA0029_SORA_RATE NUMBER(7,4),																																						
	ABA0029_SORA_INDEX NUMBER(13,10),																																						
	ABA0029_COMP_SORA_1MTH NUMBER(7,4),																																						
	ABA0029_COMP_SORA_3MTH NUMBER(7,4),																																						
	ABA0029_COMP_SORA_6MTH NUMBER(7,4),																																						
	ABA0029_AGGREGATE_VOLUME NUMBER(5,0),																																						
	ABA0029_HIGH_TRANS_RATE NUMBER(7,4),																																						
	ABA0029_LOW_TRANS_RATE NUMBER(7,4),																																						
	ABA0029_CALCULATION_METHOD VARCHAR2(150 BYTE),																																						
	ABA0029_LAST_PUBLISHED_DT TIMESTAMP (6),																																						
	ABA0029_LAST_MODIFIED_DT TIMESTAMP (6),																																						
	ABA0029_LAST_MODIFIED_BY VARCHAR2(8 BYTE)																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table ABA0030_CORP_PASS_MAPPING																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."ABA0030_CORP_PASS_MAPPING"																																							
(	ABA0030_BANK_CODE CHAR(4 BYTE),																																						
	ABA0030_CP_ENTITY_ID VARCHAR2(10 BYTE),																																						
	ABA0030_CP_UID VARCHAR2(100 BYTE),																																						
	ABA0030_TOKEN_USER_ID VARCHAR2(8 BYTE),																																						
	ABA0030_ACTIVE_IND VARCHAR2(1 BYTE),																																						
	ABA0030_LAST_LOGIN_DT TIMESTAMP (6),																																						
	ABA0030_LAST_MODIFIED_DT TIMESTAMP (6) DEFAULT SYSDATE,																																						
	ABA0030_UPDATED_BY VARCHAR2(20 BYTE)																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table ABA0031_OUTSTANDING_FRN																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."ABA0031_OUTSTANDING_FRN"																																							
(	ABA0031_YEAR VARCHAR2(4 BYTE),																																						
	ABA0031_MONTH VARCHAR2(2 BYTE),																																						
	ABA0031_MONTH6 NUMBER(13,0) DEFAULT 0,																																						
	ABA0031_YEAR1 NUMBER(13,0) DEFAULT 0,																																						
	ABA0031_YEAR2 NUMBER(13,0) DEFAULT 0,																																						
	ABA0031_YEAR5 NUMBER(13,0) DEFAULT 0,																																						
	ABA0031_YEAR10 NUMBER(13,0) DEFAULT 0,																																						
	ABA0031_YEAR15 NUMBER(13,0) DEFAULT 0,																																						
	ABA0031_YEAR20 NUMBER(13,0) DEFAULT 0,																																						
	ABA0031_YEAR30 NUMBER(13,0) DEFAULT 0,																																						
	ABA0031_OTH NUMBER(13,0) DEFAULT 0																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table ABA0031_OUTSTANDING_FRN_BKP																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."ABA0031_OUTSTANDING_FRN_BKP"																																							
(	ABA0031_YEAR VARCHAR2(4 BYTE),																																						
	ABA0031_MONTH VARCHAR2(2 BYTE),																																						
	ABA0031_MONTH6 NUMBER(13,0),																																						
	ABA0031_YEAR1 NUMBER(13,0),																																						
	ABA0031_YEAR2 NUMBER(13,0),																																						
	ABA0031_YEAR5 NUMBER(13,0),																																						
	ABA0031_YEAR10 NUMBER(13,0),																																						
	ABA0031_YEAR15 NUMBER(13,0),																																						
	ABA0031_YEAR20 NUMBER(13,0),																																						
	ABA0031_YEAR30 NUMBER(13,0),																																						
	ABA0031_OTH NUMBER(13,0)																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table ABA0032_EAPPS_CONFIG																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."ABA0032_EAPPS_CONFIG"																																							
(	ABA0032_KEY VARCHAR2(50 BYTE),																																						
	ABA0032_VALUE VARCHAR2(100 BYTE)																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table ABA0033_ISSUANCE_REDEMPT_SGS																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."ABA0033_ISSUANCE_REDEMPT_SGS"																																							
(	ABA0033_YEAR VARCHAR2(4 BYTE),																																						
	ABA0033_MONTH VARCHAR2(2 BYTE),																																						
	ABA0033_QUARTER VARCHAR2(2 BYTE),																																						
	ABA0033_SECURITY_CATEGORY VARCHAR2(20 BYTE) DEFAULT 0,																																						
	ABA0033_ISSUANCE_AMOUNT NUMBER(20,0) DEFAULT 0,																																						
	ABA0033_REDEMPTION_AMOUNT NUMBER(20,0) DEFAULT 0																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table ABA0033_ISSUANCE_REDEMPT_SGS_BKP																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."ABA0033_ISSUANCE_REDEMPT_SGS_BKP"																																							
(	ABA0033_YEAR VARCHAR2(4 BYTE),																																						
	ABA0033_MONTH VARCHAR2(2 BYTE),																																						
	ABA0033_QUARTER VARCHAR2(2 BYTE),																																						
	ABA0033_SECURITY_CATEGORY VARCHAR2(20 BYTE) DEFAULT 0,																																						
	ABA0033_ISSUANCE_AMOUNT NUMBER(20,0) DEFAULT 0,																																						
	ABA0033_REDEMPTION_AMOUNT NUMBER(20,0) DEFAULT 0																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table ABA0034_EAPPS_SUBMISSION_CUTOFF_TIME																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."ABA0034_EAPPS_SUBMISSION_CUTOFF_TIME"																																							
(	ABA0034_NAME VARCHAR2(50 BYTE),																																						
	ABA0034_DEFAULT_CUTOFF_TIME VARCHAR2(100 BYTE),																																						
	ABA0034_CUTOFF_TIME VARCHAR2(100 BYTE),																																						
	ABA0034_STATUS CHAR(1 BYTE),																																						
	ABA0034_MODIFIED_BY VARCHAR2(20 BYTE),																																						
	ABA0034_MODIFIED_DATE TIMESTAMP (6)																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table ABA0034_STG_SC_SECURITY_MASTER																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."ABA0034_STG_SC_SECURITY_MASTER"																																							
(	ABA0034_SECURITY_CODE CHAR(8 BYTE),																																						
	ABA0034_ISSUE_NO VARCHAR2(3 BYTE),																																						
	ABA0034_CURR CHAR(3 BYTE),																																						
	ABA0034_SECURITY_NAME VARCHAR2(50 BYTE),																																						
	ABA0034_ISSUE_DATE DATE,																																						
	ABA0034_TENDER_DATE DATE,																																						
	ABA0034_ISSUE_SIZE NUMBER(16,0),																																						
	ABA0034_QTY_APPLIED NUMBER(16,0),																																						
	ABA0034_AVE_YIELD NUMBER(5,2),																																						
	ABA0034_CUTOFF_YIELD NUMBER(5,2),																																						
	ABA0034_MATURITY_DATE DATE,																																						
	ABA0034_PERCENT_COY NUMBER(5,2),																																						
	ABA0034_PERCENT_SUB NUMBER(5,2),																																						
	ABA0034_INTEREST_RATE NUMBER(7,4),																																						
	ABA0034_TAX_STATUS CHAR(1 BYTE),																																						
	ABA0034_AVE_PRICE NUMBER(7,4),																																						
	ABA0034_COY_PRICE NUMBER(7,4),																																						
	ABA0034_CLOSING_PRICE NUMBER(9,4),																																						
	ABA0034_REFERENCE_NO NUMBER(5,0),																																						
	ABA0034_ISIN_CODE CHAR(12 BYTE),																																						
	ABA0034_ANNOUNCE_DATE DATE,																																						
	ABA0034_RESULT_LOAD_DATE DATE,																																						
	ABA0034_LAST_INT_DATE DATE,																																						
	ABA0034_NEXT_INT_DATE DATE,																																						
	ABA0034_ACCRUED_INT_DAYS NUMBER(3,0),																																						
	ABA0034_INT_DATE1 DATE,																																						
	ABA0034_INT_DATE2 DATE,																																						
	ABA0034_INT_PAID_IND CHAR(1 BYTE),																																						
	ABA0034_TENOR NUMBER(3,0),																																						
	ABA0034_ETENDER_IND CHAR(1 BYTE),																																						
	ABA0034_MAS_APPLIED NUMBER(16,0),																																						
	ABA0034_MAS_ALLOTTED NUMBER(16,0),																																						
	ABA0034_NC_PERCENT NUMBER(5,2),																																						
	ABA0034_NC_QTY_ALLOT NUMBER(16,0),																																						
	ABA0034_EX_INT_DATE DATE,																																						
	ABA0034_QTY_APP_COMP NUMBER(13,0),																																						
	ABA0034_QTY_APP_NONCOMP NUMBER(13,0),																																						
	ABA0034_ACCRUED_INT NUMBER(7,4),																																						
	ABA0034_ANNOUNCE_INDICATOR CHAR(1 BYTE),																																						
	ABA0034_MEDIAN_YIELD NUMBER(5,2),																																						
	ABA0034_MEDIAN_PRICE NUMBER(7,4),																																						
	ABA0034_SEC_CAT VARCHAR2(10 BYTE),																																						
	ABA0034_SEC_TYPE_ID VARCHAR2(10 BYTE),																																						
	ABA0034_SEC_TYPE_DESC VARCHAR2(35 BYTE),																																						
	ABA0034_BENCHMARK_IND CHAR(1 BYTE),																																						
	ABA0034_FIRST_CPN_PAYM_DATE DATE,																																						
	ABA0034_TENOR_UNIT CHAR(1 BYTE),																																						
	ABA0034_RECORD_DATE DATE																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table ABA0035_RETAILBID_FILE																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."ABA0035_RETAILBID_FILE"																																							
(	ABA0035_BANK_ACC_CODE NUMBER(4,0),																																						
	ABA0035_PROCESSING_DATE DATE,																																						
	ABA0035_FILE_NAME VARCHAR2(50 BYTE),																																						
	ABA0035_FILE BLOB,																																						
	ABA0035_MODIFIED_TIME TIMESTAMP (6),																																						
	ABA0035_MODIFIED_USER_ID VARCHAR2(8 BYTE),																																						
	ABA0035_ACKNOWLEDGEMENT_FILE BLOB,																																						
	ABA0035_ACKNOWLEDGEMENT_FILE_NAME VARCHAR2(150 BYTE)																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP"																																							
LOB ("ABA0035_FILE") STORE AS SECUREFILE (																																							
TABLESPACE "NETAPP" ENABLE STORAGE IN ROW CHUNK 8192																																							
NOCACHE LOGGING  NOCOMPRESS  KEEP_DUPLICATES																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT))																																							
LOB ("ABA0035_ACKNOWLEDGEMENT_FILE") STORE AS SECUREFILE (																																							
TABLESPACE "NETAPP" ENABLE STORAGE IN ROW CHUNK 8192																																							
NOCACHE LOGGING  NOCOMPRESS  KEEP_DUPLICATES																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)) ;																																							
--------------------------------------------------------																																							
--  DDL for Table ABA0035_RETAILBID_FILE_TMP																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."ABA0035_RETAILBID_FILE_TMP"																																							
(	ABA0035_BANK_ACC_CODE NUMBER(4,0),																																						
	ABA0035_PROCESSING_DATE DATE,																																						
	ABA0035_FILE_NAME VARCHAR2(50 BYTE),																																						
	ABA0035_FILE BLOB,																																						
	ABA0035_MODIFIED_TIME TIMESTAMP (6),																																						
	ABA0035_MODIFIED_USER_ID VARCHAR2(8 BYTE),																																						
	ABA0035_ACKNOWLEDGEMENT_FILE BLOB,																																						
	ABA0035_ACKNOWLEDGEMENT_FILE_NAME VARCHAR2(150 BYTE)																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP"																																							
LOB ("ABA0035_FILE") STORE AS SECUREFILE (																																							
TABLESPACE "NETAPP" ENABLE STORAGE IN ROW CHUNK 8192																																							
NOCACHE LOGGING  NOCOMPRESS  KEEP_DUPLICATES																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT))																																							
LOB ("ABA0035_ACKNOWLEDGEMENT_FILE") STORE AS SECUREFILE (																																							
TABLESPACE "NETAPP" ENABLE STORAGE IN ROW CHUNK 8192																																							
NOCACHE LOGGING  NOCOMPRESS  KEEP_DUPLICATES																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)) ;																																							
--------------------------------------------------------																																							
--  DDL for Table ABA0036_STAGE_SORA_AMMO																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."ABA0036_STAGE_SORA_AMMO"																																							
(	ABA0036_SORA_PUB_DT DATE,																																						
	ABA0036_SORA_VALUE_DT DATE,																																						
	ABA0036_SORA_RATE NUMBER(7,4),																																						
	ABA0036_SORA_INDEX NUMBER(13,10),																																						
	ABA0036_COMP_SORA_1MTH NUMBER(7,4),																																						
	ABA0036_COMP_SORA_3MTH NUMBER(7,4),																																						
	ABA0036_COMP_SORA_6MTH NUMBER(7,4),																																						
	ABA0036_AGGREGATE_VOLUME NUMBER(5,0),																																						
	ABA0036_HIGH_TRANS_RATE NUMBER(7,4),																																						
	ABA0036_LOW_TRANS_RATE NUMBER(7,4),																																						
	ABA0036_CALCULATION_METHOD VARCHAR2(150 BYTE),																																						
	ABA0036_LAST_MODIFIED_BY VARCHAR2(8 BYTE)																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table ABA0036_STAGE_SORA_AMMO_T																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."ABA0036_STAGE_SORA_AMMO_T"																																							
(	ABA0036_SORA_PUB_DT DATE,																																						
	ABA0036_SORA_VALUE_DT DATE,																																						
	ABA0036_SORA_RATE NUMBER(7,4),																																						
	ABA0036_SORA_INDEX NUMBER(13,10),																																						
	ABA0036_COMP_SORA_1MTH NUMBER(7,4),																																						
	ABA0036_COMP_SORA_3MTH NUMBER(7,4),																																						
	ABA0036_COMP_SORA_6MTH NUMBER(7,4),																																						
	ABA0036_AGGREGATE_VOLUME NUMBER(5,0),																																						
	ABA0036_HIGH_TRANS_RATE NUMBER(7,4),																																						
	ABA0036_LOW_TRANS_RATE NUMBER(7,4),																																						
	ABA0036_CALCULATION_METHOD VARCHAR2(150 BYTE),																																						
	ABA0036_LAST_MODIFIED_BY VARCHAR2(8 BYTE)																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table ABA0101_SB_SECURITY_MASTER																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."ABA0101_SB_SECURITY_MASTER"																																							
(	ABA0101_SB_SECURITY_CODE CHAR(8 BYTE),																																						
	ABA0101_SB_ISSUE_NO CHAR(1 BYTE),																																						
	ABA0101_SB_ISSUE_TYPE CHAR(1 BYTE),																																						
	ABA0101_SB_CURR CHAR(3 BYTE),																																						
	ABA0101_SB_SECURITY_NAME VARCHAR2(30 BYTE),																																						
	ABA0101_SB_ISSUE_DATE DATE,																																						
	ABA0101_SB_TENDER_DATE DATE,																																						
	ABA0101_SB_ISSUE_SIZE NUMBER(13,0),																																						
	ABA0101_SB_QTY_APPLIED NUMBER(13,0),																																						
	ABA0101_SB_CUTOFF_AMT NUMBER(13,0),																																						
	ABA0101_SB_MATURITY_DATE DATE,																																						
	ABA0101_SB_INTEREST_RATE NUMBER(7,4),																																						
	ABA0101_SB_TAX_STATUS CHAR(1 BYTE),																																						
	ABA0101_SB_REFERENCE_NO NUMBER(13,0),																																						
	ABA0101_SB_ISIN_CODE CHAR(12 BYTE),																																						
	ABA0101_SB_ANNOUNCE_DATE DATE,																																						
	ABA0101_SB_RESULT_LOAD_DATE DATE,																																						
	ABA0101_SB_LAST_INT_DATE DATE,																																						
	ABA0101_SB_NEXT_INT_DATE DATE,																																						
	ABA0101_SB_INT_DATE1 DATE,																																						
	ABA0101_SB_INT_DATE2 DATE,																																						
	ABA0101_SB_INT_PAID_IND CHAR(1 BYTE),																																						
	ABA0101_SB_TENOR NUMBER(3,0),																																						
	ABA0101_SB_EX_INT_DATE DATE,																																						
	ABA0101_SB_ANNOUNCE_INDICATOR CHAR(1 BYTE),																																						
	ABA0101_SB_QTY_ALLOTTED NUMBER(13,0),																																						
	ABA0101_SB_QTY_REJECTED NUMBER(13,0),																																						
	ABA0101_SB_QTY_REDEEMED NUMBER(13,0),																																						
	ABA0101_SB_RANDOM_ALLOT_AMT NUMBER(13,0),																																						
	ABA0101_SB_RANDOM_ALLOT_RATE NUMBER(4,2)																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 2097152 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table ABA0101_SB_SECURITY_MASTER_T																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."ABA0101_SB_SECURITY_MASTER_T"																																							
(	ABA0101_SB_SECURITY_CODE CHAR(8 BYTE),																																						
	ABA0101_SB_ISSUE_NO VARCHAR2(3 BYTE),																																						
	ABA0101_SB_CURR CHAR(3 BYTE),																																						
	ABA0101_SB_SECURITY_NAME VARCHAR2(50 BYTE),																																						
	ABA0101_SB_ISSUE_DATE DATE,																																						
	ABA0101_SB_TENDER_DATE DATE,																																						
	ABA0101_SB_ISSUE_SIZE NUMBER(16,0),																																						
	ABA0101_SB_QTY_APPLIED NUMBER(16,0),																																						
	ABA0101_SB_CUTOFF_AMT NUMBER(13,0),																																						
	ABA0101_SB_MATURITY_DATE DATE,																																						
	ABA0101_SB_INTEREST_RATE NUMBER(7,4),																																						
	ABA0101_SB_TAX_STATUS CHAR(1 BYTE),																																						
	ABA0101_SB_REFERENCE_NO NUMBER(13,0),																																						
	ABA0101_SB_ISIN_CODE CHAR(12 BYTE),																																						
	ABA0101_SB_ANNOUNCE_DATE DATE,																																						
	ABA0101_SB_RESULT_LOAD_DATE DATE,																																						
	ABA0101_SB_LAST_INT_DATE DATE,																																						
	ABA0101_SB_NEXT_INT_DATE DATE,																																						
	ABA0101_SB_INT_DATE1 DATE,																																						
	ABA0101_SB_INT_DATE2 DATE,																																						
	ABA0101_SB_INT_PAID_IND CHAR(1 BYTE),																																						
	ABA0101_SB_TENOR NUMBER(3,0),																																						
	ABA0101_SB_EX_INT_DATE DATE,																																						
	ABA0101_SB_ANNOUNCE_INDICATOR CHAR(1 BYTE),																																						
	ABA0101_SB_QTY_ALLOTTED NUMBER(16,0),																																						
	ABA0101_SB_QTY_REJECTED NUMBER(16,0),																																						
	ABA0101_SB_QTY_REDEEMED NUMBER(13,0),																																						
	ABA0101_SB_RANDOM_ALLOT_AMT NUMBER(13,0),																																						
	ABA0101_SB_RANDOM_ALLOT_RATE NUMBER(4,2),																																						
	ABA0101_SB_SEC_CAT VARCHAR2(10 BYTE),																																						
	ABA0101_SB_SEC_TYPE_ID VARCHAR2(10 BYTE),																																						
	ABA0101_SB_SEC_TYPE_DESC VARCHAR2(35 BYTE),																																						
	ABA0101_SB_FIRST_CPN_PAYM_DATE DATE,																																						
	ABA0101_SB_TENOR_UNIT CHAR(1 BYTE),																																						
	ABA0101_SB_RECORD_DATE DATE,																																						
	ABA0101_SB_BENCHMARK_IND CHAR(1 BYTE)																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table ABA0108_SB_STAGE_SEC_MASTER																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."ABA0108_SB_STAGE_SEC_MASTER"																																							
(	ABA0108_SB_SECURITY_CODE CHAR(8 BYTE),																																						
	ABA0108_SB_ISSUE_NO CHAR(1 BYTE),																																						
	ABA0108_SB_ISSUE_TYPE CHAR(1 BYTE),																																						
	ABA0108_SB_CURR CHAR(3 BYTE),																																						
	ABA0108_SB_SECURITY_NAME VARCHAR2(30 BYTE),																																						
	ABA0108_SB_ISSUE_DATE DATE,																																						
	ABA0108_SB_TENDER_DATE DATE,																																						
	ABA0108_SB_ISSUE_SIZE NUMBER(13,0),																																						
	ABA0108_SB_QTY_APPLIED NUMBER(13,0),																																						
	ABA0108_SB_CUTOFF_AMT NUMBER(13,0),																																						
	ABA0108_SB_MATURITY_DATE DATE,																																						
	ABA0108_SB_INTEREST_RATE NUMBER(7,4),																																						
	ABA0108_SB_TAX_STATUS CHAR(1 BYTE),																																						
	ABA0108_SB_REFERENCE_NO NUMBER(13,0),																																						
	ABA0108_SB_ISIN_CODE CHAR(12 BYTE),																																						
	ABA0108_SB_ANNOUNCE_DATE DATE,																																						
	ABA0108_SB_RESULT_LOAD_DATE DATE,																																						
	ABA0108_SB_LAST_INT_DATE DATE,																																						
	ABA0108_SB_NEXT_INT_DATE DATE,																																						
	ABA0108_SB_INT_DATE1 DATE,																																						
	ABA0108_SB_INT_DATE2 DATE,																																						
	ABA0108_SB_INT_PAID_IND CHAR(1 BYTE),																																						
	ABA0108_SB_TENOR NUMBER(3,0),																																						
	ABA0108_SB_EX_INT_DATE DATE,																																						
	ABA0108_SB_ANNOUNCE_INDICATOR CHAR(1 BYTE),																																						
	ABA0108_SB_QTY_ALLOTTED NUMBER(13,0),																																						
	ABA0108_SB_QTY_REJECTED NUMBER(13,0),																																						
	ABA0108_SB_QTY_REDEEMED NUMBER(13,0),																																						
	ABA0108_SB_RANDOM_ALLOT_AMT NUMBER(13,0),																																						
	ABA0108_SB_RANDOM_ALLOT_RATE NUMBER(2,0)																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 2097152 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table ABA0110_SB_ANNOUNCE_TEXT																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."ABA0110_SB_ANNOUNCE_TEXT"																																							
(	ABA0110_NAME VARCHAR2(8 BYTE),																																						
	ABA0110_USED_BEFORE DATE,																																						
	ABA0110_TEXT VARCHAR2(4000 BYTE),																																						
	ABA0110_LAST_UPDATED DATE																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 2097152 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table ABA0121_SB_ISSUE_CALENDAR																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."ABA0121_SB_ISSUE_CALENDAR"																																							
(	ABA0121_SECURITY_CODE VARCHAR2(8 BYTE),																																						
	ABA0121_ISSUE_NO VARCHAR2(1 BYTE),																																						
	ABA0121_ISIN_CODE VARCHAR2(12 BYTE),																																						
	ABA0121_ISSUE_TYPE VARCHAR2(1 BYTE),																																						
	ABA0121_TENOR NUMBER(3,0),																																						
	ABA0121_TENOR_UNIT VARCHAR2(1 BYTE),																																						
	ABA0121_CURR VARCHAR2(3 BYTE),																																						
	ABA0121_NEW_REOPEN VARCHAR2(1 BYTE),																																						
	ABA0121_OPEN_DATETIME DATE,																																						
	ABA0121_CLOSE_DATETIME DATE,																																						
	ABA0121_ISSUE_DATETIME DATE,																																						
	ABA0121_FLAG VARCHAR2(1 BYTE)																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 2097152 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table ABA0124_SB_COUPON_RATE_DETAILS																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."ABA0124_SB_COUPON_RATE_DETAILS"																																							
(	ABA0124_ISSUE_CODE CHAR(8 BYTE),																																						
	ABA0124_YEAR_NUMBER NUMBER(2,0),																																						
	ABA0124_COUPON_NUMBER NUMBER(2,0),																																						
	ABA0124_COUPON_PAYMENT_DATE DATE,																																						
	ABA0124_COUPON_RATE NUMBER(13,5),																																						
	ABA0124_RETURN_RATE NUMBER(13,5)																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 2097152 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table ABA0125_SB_STAGE_COUPON_RATE																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."ABA0125_SB_STAGE_COUPON_RATE"																																							
(	COL1 VARCHAR2(20 BYTE),																																						
	COL2 VARCHAR2(20 BYTE),																																						
	COL3 VARCHAR2(20 BYTE),																																						
	COL4 VARCHAR2(20 BYTE)																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 2097152 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table ABA0126_SB_REDEMPTION_RESULT																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."ABA0126_SB_REDEMPTION_RESULT"																																							
(	ABA0126_SB_REDEMPTION_DATE DATE,																																						
	ABA0126_SB_SECURITY_CODE CHAR(8 BYTE),																																						
	ABA0126_SB_QTY_REDEEMED NUMBER(13,0),																																						
	ABA0126_SB_QTY_OUTSTANDING NUMBER(13,0)																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 2097152 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table ABA0127_SB_SYSTEM_CONFIG																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."ABA0127_SB_SYSTEM_CONFIG"																																							
(	ABA0127_SB_PROPERTY_NAME VARCHAR2(100 BYTE),																																						
	ABA0127_SB_PROPERTY_VALUE VARCHAR2(255 BYTE),																																						
	ABA0127_SB_CREATED_DT TIMESTAMP (6),																																						
	ABA0127_SB_LAST_MODIFIED_DT TIMESTAMP (6)																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 2097152 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table ABA0134_STG_SB_SC_SEC_MASTER																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."ABA0134_STG_SB_SC_SEC_MASTER"																																							
(	ABA0134_SB_SECURITY_CODE CHAR(8 BYTE),																																						
	ABA0134_SB_ISSUE_NO VARCHAR2(3 BYTE),																																						
	ABA0134_SB_CURR CHAR(3 BYTE),																																						
	ABA0134_SB_SECURITY_NAME VARCHAR2(50 BYTE),																																						
	ABA0134_SB_ISSUE_DATE DATE,																																						
	ABA0134_SB_TENDER_DATE DATE,																																						
	ABA0134_SB_ISSUE_SIZE NUMBER(16,0),																																						
	ABA0134_SB_QTY_APPLIED NUMBER(16,0),																																						
	ABA0134_SB_CUTOFF_AMT NUMBER(13,0),																																						
	ABA0134_SB_MATURITY_DATE DATE,																																						
	ABA0134_SB_INTEREST_RATE NUMBER(7,4),																																						
	ABA0134_SB_TAX_STATUS CHAR(1 BYTE),																																						
	ABA0134_SB_REFERENCE_NO NUMBER(13,0),																																						
	ABA0134_SB_ISIN_CODE CHAR(12 BYTE),																																						
	ABA0134_SB_ANNOUNCE_DATE DATE,																																						
	ABA0134_SB_RESULT_LOAD_DATE DATE,																																						
	ABA0134_SB_LAST_INT_DATE DATE,																																						
	ABA0134_SB_NEXT_INT_DATE DATE,																																						
	ABA0134_SB_INT_DATE1 DATE,																																						
	ABA0134_SB_INT_DATE2 DATE,																																						
	ABA0134_SB_INT_PAID_IND CHAR(1 BYTE),																																						
	ABA0134_SB_TENOR NUMBER(3,0),																																						
	ABA0134_SB_EX_INT_DATE DATE,																																						
	ABA0134_SB_ANNOUNCE_INDICATOR CHAR(1 BYTE),																																						
	ABA0134_SB_QTY_ALLOTTED NUMBER(13,0),																																						
	ABA0134_SB_QTY_REJECTED NUMBER(13,0),																																						
	ABA0134_SB_QTY_REDEEMED NUMBER(13,0),																																						
	ABA0134_SB_RANDOM_ALLOT_AMT NUMBER(13,0),																																						
	ABA0134_SB_RANDOM_ALLOT_RATE NUMBER(4,2),																																						
	ABA0134_SB_SEC_CAT VARCHAR2(10 BYTE),																																						
	ABA0134_SB_SEC_TYPE_ID VARCHAR2(10 BYTE),																																						
	ABA0134_SB_SEC_TYPE_DESC VARCHAR2(35 BYTE),																																						
	ABA0134_SB_FIRST_CPN_PAYM_DATE DATE,																																						
	ABA0134_SB_TENOR_UNIT CHAR(1 BYTE),																																						
	ABA0134_SB_RECORD_DATE DATE,																																						
	ABA0134_SB_BENCHMARK_IND CHAR(1 BYTE)																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP" ;																																							
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
TABLESPACE "NETAPP" ;																																							
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
	ABA0222_SB_OMNIBUS_ACCT_NO VARCHAR2(16 BYTE),																																						
	ABA0222_SB_PGP_RECIPIENT_KEY VARCHAR2(50 BYTE)																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table ABA0223_SB_PGP_CONFIG																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."ABA0223_SB_PGP_CONFIG"																																							
(	ABA0223_SB_PGP_PROPERTY_KEY VARCHAR2(30 BYTE),																																						
	ABA0223_SB_PGP_PROPERTY_VALUE VARCHAR2(100 BYTE)																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table ABA0501_ENCRYPTED_REPO_TRANS																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."ABA0501_ENCRYPTED_REPO_TRANS"																																							
(	ABA0501_BANK_CODE CHAR(4 BYTE),																																						
	ABA0501_TRANS_REF_NO CHAR(16 BYTE),																																						
	ABA0501_ENCRYPTED_TRANSACTION CLOB,																																						
	ABA0501_CHECKSUM VARCHAR2(512 BYTE),																																						
	ABA0501_STATUS_FLAG CHAR(1 BYTE) DEFAULT 'I',																																						
	ABA0501_UPDATED_DT DATE,																																						
	ABA0501_RECEIVED_DT DATE																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 2097152 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP"																																							
LOB ("ABA0501_ENCRYPTED_TRANSACTION") STORE AS BASICFILE (																																							
TABLESPACE "NETAPP" ENABLE STORAGE IN ROW CHUNK 8192 PCTVERSION 10																																							
NOCACHE LOGGING																																							
STORAGE(INITIAL 65536 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)) ;																																							
--------------------------------------------------------																																							
--  DDL for Table ABA0502_PUB_KEY																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."ABA0502_PUB_KEY"																																							
(	ABA0502_PUBLIC_KEY VARCHAR2(2048 BYTE),																																						
	ABA0502_UPDATED_DT DATE,																																						
	ABA0502_CURRENT_KEY VARCHAR2(1 BYTE)																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS NOLOGGING																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table ABA0503_OPEN_ISSUES																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."ABA0503_OPEN_ISSUES"																																							
(	ABA0503_SECURITY_CODE CHAR(8 BYTE),																																						
	ABA0503_AMT_OFFERED NUMBER(13,0),																																						
	ABA0503_SETTLEMENT_DT_IND CHAR(2 BYTE),																																						
	ABA0503_OPENED CHAR(1 BYTE),																																						
	ABA0503_VOIDED CHAR(1 BYTE) DEFAULT 'N',																																						
	ABA0503_OPENED_DT DATE,																																						
	ABA0503_UPDATED_DT DATE																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table ABA0504_AUCTION_SUMMARY																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."ABA0504_AUCTION_SUMMARY"																																							
(	ABA0504_SECURITY_CODE CHAR(8 BYTE),																																						
	ABA0504_SETTLEMENT_DATE DATE,																																						
	ABA0504_TOT_AMT_OFFERED NUMBER(13,0),																																						
	ABA0504_TOT_AMT_APPLIED NUMBER(13,0),																																						
	ABA0504_TOT_AMT_ALLOTED NUMBER(13,0),																																						
	ABA0504_AVER_REPO_RATE NUMBER(10,7),																																						
	ABA0504_CUT_OFF_REPO_RATE NUMBER(7,4),																																						
	ABA0504_PCT_ALLOT_CUT_OFF NUMBER(7,4),																																						
	ABA0504_CLEAN_PRICE NUMBER(7,4),																																						
	ABA0504_DIRTY_PRICE NUMBER(7,4),																																						
	ABA0504_HAIRCUT NUMBER(7,4),																																						
	ABA0504_AUCTION_DT DATE,																																						
	ABA0504_UPDATED_DT DATE,																																						
	ABA0504_HAIRCUT_CLEAN_PRICE NUMBER(7,4),																																						
	ABA0504_HAIRCUT_DIRTY_PRICE NUMBER(7,4)																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table ABA0505_AUCTION_DETAILS																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."ABA0505_AUCTION_DETAILS"																																							
(	ABA0505_SECURITY_CODE CHAR(8 BYTE),																																						
	ABA0505_BANK_CODE CHAR(4 BYTE),																																						
	ABA0505_SEQ_NO CHAR(5 BYTE),																																						
	ABA0505_TRANS_REF_NO CHAR(16 BYTE),																																						
	ABA0505_AMT_APPLIED NUMBER(13,0),																																						
	ABA0505_CLEAN_PRICE NUMBER(7,4),																																						
	ABA0505_DIRTY_PRICE NUMBER(7,4),																																						
	ABA0505_AMT_ALLOTED NUMBER(13,0),																																						
	ABA0505_ALLOT_STATUS CHAR(1 BYTE),																																						
	ABA0505_EXG_SEC_CODE CHAR(8 BYTE),																																						
	ABA0505_EXG_NOMINAL_AMT NUMBER(13,0),																																						
	ABA0505_EXG_CLEAN_PRICE NUMBER(7,4),																																						
	ABA0505_EXG_DIRTY_PRICE NUMBER(7,4),																																						
	ABA0505_REPO_RATE NUMBER(7,4),																																						
	ABA0505_REPO_FEE NUMBER(13,2),																																						
	ABA0505_AUCTION_DT DATE,																																						
	ABA0505_UPDATED_DT TIMESTAMP (3),																																						
	ABA0505_HAIRCUT_CLEAN_PRICE NUMBER(7,4),																																						
	ABA0505_HAIRCUT_DIRTY_PRICE NUMBER(7,4),																																						
	ABA0505_EXG_HC_CLEAN_PRICE NUMBER(7,4),																																						
	ABA0505_EXG_HC_DIRTY_PRICE NUMBER(7,4)																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 2097152 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table ABA0506_SYSTEM_PARM																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."ABA0506_SYSTEM_PARM"																																							
(	ABA0506_CUT_OFF_TIME DATE,																																						
	ABA0506_VIEW_RESULTS CHAR(1 BYTE) DEFAULT 'N',																																						
	ABA0506_CUTOFF_IND CHAR(1 BYTE) DEFAULT 'N'																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table ABA0507_SPLIT_BIDS																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."ABA0507_SPLIT_BIDS"																																							
(	ABA0507_TRANS_REF_NO CHAR(16 BYTE),																																						
	ABA0507_SEQ_NO CHAR(5 BYTE),																																						
	ABA0507_UNSUCCESS_AMT NUMBER(13,0),																																						
	ABA0507_AUCTION_DT DATE																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table ABA0601_ENCRYPTED_REPO_TRANS																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."ABA0601_ENCRYPTED_REPO_TRANS"																																							
(	ABA0601_BANK_CODE CHAR(4 BYTE),																																						
	ABA0601_TRANS_REF_NO CHAR(16 BYTE),																																						
	ABA0601_ENCRYPTED_TRANSACTION CLOB,																																						
	ABA0601_CHECKSUM VARCHAR2(512 BYTE),																																						
	ABA0601_STATUS_FLAG CHAR(1 BYTE) DEFAULT 'I',																																						
	ABA0601_UPDATED_DT DATE,																																						
	ABA0601_RECEIVED_DT DATE,																																						
	ABA0601_WITHDRAWN_DT DATE,																																						
	ABA0601_WITHDRAWN_BY VARCHAR2(8 BYTE),																																						
	ABA0601_SUBMITTED_BY VARCHAR2(8 BYTE)																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 2097152 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP"																																							
LOB ("ABA0601_ENCRYPTED_TRANSACTION") STORE AS BASICFILE (																																							
TABLESPACE "NETAPP" ENABLE STORAGE IN ROW CHUNK 8192 RETENTION																																							
NOCACHE LOGGING																																							
STORAGE(INITIAL 65536 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)) ;																																							
--------------------------------------------------------																																							
--  DDL for Table ABA0603_OPEN_ISSUES																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."ABA0603_OPEN_ISSUES"																																							
(	ABA0603_SECURITY_CODE CHAR(8 BYTE),																																						
	ABA0603_VOIDED CHAR(1 BYTE) DEFAULT 'N',																																						
	ABA0603_OPENED_DT DATE,																																						
	ABA0603_UPDATED_DT DATE																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table ABA0605_TRADE_DETAILS																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."ABA0605_TRADE_DETAILS"																																							
(	ABA0605_SECURITY_CODE CHAR(8 BYTE),																																						
	ABA0605_BANK_CODE CHAR(4 BYTE),																																						
	ABA0605_SEQ_NO CHAR(5 BYTE),																																						
	ABA0605_TRANS_REF_NO CHAR(16 BYTE),																																						
	ABA0605_AMT_APPLIED NUMBER(13,0),																																						
	ABA0605_AMT_ALLOTTED NUMBER(13,0),																																						
	ABA0605_CLEAN_PRICE NUMBER(7,4),																																						
	ABA0605_HAIRCUT_CLEAN_PRICE NUMBER(7,4),																																						
	ABA0605_DIRTY_PRICE NUMBER(7,4),																																						
	ABA0605_HAIRCUT_DIRTY_PRICE NUMBER(7,4),																																						
	ABA0605_LIMIT_IND CHAR(1 BYTE),																																						
	ABA0605_EXG_SEC_CODE CHAR(8 BYTE),																																						
	ABA0605_EXG_NOMINAL_AMT NUMBER(13,0),																																						
	ABA0605_EXG_CLEAN_PRICE NUMBER(7,4),																																						
	ABA0605_EXG_HC_CLEAN_PRICE NUMBER(7,4),																																						
	ABA0605_EXG_DIRTY_PRICE NUMBER(7,4),																																						
	ABA0605_EXG_HC_DIRTY_PRICE NUMBER(7,4),																																						
	ABA0605_REPO_RATE NUMBER(7,4),																																						
	ABA0605_REPO_FEE NUMBER(13,2),																																						
	ABA0605_S_DURATION NUMBER(7,4),																																						
	ABA0605_G_DURATION NUMBER(7,4),																																						
	ABA0605_S_DOLLAR_DURATION NUMBER(20,2),																																						
	ABA0605_G_DOLLAR_DURATION NUMBER(20,2),																																						
	ABA0605_NET_CASH NUMBER(20,2),																																						
	ABA0605_STATUS_FLAG CHAR(1 BYTE) DEFAULT 'N',																																						
	ABA0605_RECEIVED_DT DATE,																																						
	ABA0605_UPDATED_DT TIMESTAMP (3),																																						
	ABA0605_FMBS_REF_NO CHAR(10 BYTE)																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 2097152 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table ABA0606_SYSTEM_PARM																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."ABA0606_SYSTEM_PARM"																																							
(	ABA0606_CUT_OFF_TIME DATE,																																						
	ABA0606_VIEW_RESULTS CHAR(1 BYTE) DEFAULT 'N',																																						
	ABA0606_MIN_LIMIT_PER_ISSUE NUMBER(20,0) DEFAULT 1000000,																																						
	ABA0606_MAX_LIMIT_PER_ISSUE NUMBER(20,0) DEFAULT 50000000,																																						
	ABA0606_MAX_LIMIT_ALL_ISSUE NUMBER(20,0) DEFAULT 500000000,																																						
	ABA0606_MAX_LIMIT_ALL_INFRA NUMBER(20,0) DEFAULT 500000000																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table ABA0607_SPLIT_BIDS																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."ABA0607_SPLIT_BIDS"																																							
(	ABA0607_TRANS_REF_NO CHAR(16 BYTE),																																						
	ABA0607_SEQ_NO CHAR(5 BYTE),																																						
	ABA0607_UNSUCCESS_AMT NUMBER(13,0),																																						
	ABA0607_AUCTION_DT DATE																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table ABA0608_LEGAL_LOG																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."ABA0608_LEGAL_LOG"																																							
(	ABA0608_BANK_CODE CHAR(4 BYTE),																																						
	ABA0608_RECEIVED_DT DATE																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table ABA0610_REJECTED_ISSUES																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."ABA0610_REJECTED_ISSUES"																																							
(	ABA0610_SECURITY_CODE CHAR(8 BYTE),																																						
	ABA0610_ISSUE_DATE DATE,																																						
	ABA0610_MATURITY_DATE DATE,																																						
	ABA0610_UPDATED_DT DATE																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table ABA2000_TASK_REGISTRY																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."ABA2000_TASK_REGISTRY"																																							
(	ABA2000_TASK_ID NUMBER(10,0),																																						
	ABA2000_TASK_DATA BLOB,																																						
	ABA2000_UPDATED_DT DATE																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 2097152 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP"																																							
LOB ("ABA2000_TASK_DATA") STORE AS BASICFILE (																																							
TABLESPACE "NETAPP" ENABLE STORAGE IN ROW CHUNK 8192 PCTVERSION 10																																							
NOCACHE LOGGING																																							
STORAGE(INITIAL 65536 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)) ;																																							
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
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table AQA0002_TRANSACTION																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."AQA0002_TRANSACTION"																																							
(	AQA0002_RECORD_TYPE CHAR(2 BYTE),																																						
	AQA0002_SECURITY_CODE CHAR(8 BYTE),																																						
	AQA0002_ISSUE_NO CHAR(1 BYTE),																																						
	AQA0002_FORM_NO NUMBER(6,0),																																						
	AQA0002_USERID CHAR(10 BYTE),																																						
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
	AQA0002_CPF_ACNO CHAR(8 BYTE),																																						
	AQA0002_EOVA_NRIC_PPNO CHAR(1 BYTE),																																						
	AQA0002_EOVA_CPF_ACNO CHAR(1 BYTE),																																						
	AQA0002_BANK_REF_NO VARCHAR2(12 BYTE),																																						
	AQA0002_REF_NO NUMBER(5,0),																																						
	AQA0002_CDP_ACNO VARCHAR2(16 BYTE),																																						
	AQA0002_SUB_MTD CHAR(1 BYTE)																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table AQA0002_TRANSACTION_20230428																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."AQA0002_TRANSACTION_20230428"																																							
(	AQA0002_RECORD_TYPE CHAR(2 BYTE),																																						
	AQA0002_SECURITY_CODE CHAR(8 BYTE),																																						
	AQA0002_ISSUE_NO VARCHAR2(3 BYTE),																																						
	AQA0002_FORM_NO NUMBER(6,0),																																						
	AQA0002_USERID CHAR(10 BYTE),																																						
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
	AQA0002_CPF_ACNO CHAR(8 BYTE),																																						
	AQA0002_EOVA_NRIC_PPNO CHAR(1 BYTE),																																						
	AQA0002_EOVA_CPF_ACNO CHAR(1 BYTE),																																						
	AQA0002_BANK_REF_NO VARCHAR2(12 BYTE),																																						
	AQA0002_REF_NO NUMBER(5,0),																																						
	AQA0002_CDP_ACNO VARCHAR2(16 BYTE),																																						
	AQA0002_SUB_MTD CHAR(1 BYTE)																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP" ;																																							
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
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP" ;																																							
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
	AQA0006_YIELD1 NUMBER(3,2),																																						
	AQA0006_NOMINAL_AMT2 NUMBER(11,0),																																						
	AQA0006_COMPETITIVE_CHECK2 CHAR(1 BYTE),																																						
	AQA0006_YIELD2 NUMBER(3,2),																																						
	AQA0006_NOMINAL_AMT3 NUMBER(11,0),																																						
	AQA0006_COMPETITIVE_CHECK3 CHAR(1 BYTE),																																						
	AQA0006_YIELD3 NUMBER(3,2),																																						
	AQA0006_NOMINAL_AMT4 NUMBER(11,0),																																						
	AQA0006_COMPETITIVE_CHECK4 CHAR(1 BYTE),																																						
	AQA0006_YIELD4 NUMBER(3,2),																																						
	AQA0006_NOMINAL_AMT5 NUMBER(11,0),																																						
	AQA0006_COMPETITIVE_CHECK5 CHAR(1 BYTE),																																						
	AQA0006_YIELD5 NUMBER(3,2),																																						
	AQA0006_NAME_OF_APPLICANT VARCHAR2(30 BYTE),																																						
	AQA0006_NATIONALITY CHAR(1 BYTE),																																						
	AQA0006_NRIC_NO VARCHAR2(14 BYTE),																																						
	AQA0006_CPF_ACC_NO CHAR(9 BYTE),																																						
	AQA0006_BANK_ACC_CODE NUMBER(4,0),																																						
	AQA0006_SETTLEMENT_BANK_CODE NUMBER(4,0),																																						
	AQA0006_BANK_OR_CUSTODIAN CHAR(1 BYTE),																																						
	AQA0006_TYPE_OF_APPLICANT VARCHAR2(3 BYTE),																																						
	AQA0006_REC_STATUS CHAR(1 BYTE),																																						
	AQA0006_CHECKSUM NUMBER(14,0),																																						
	AQA0006_UPDATED_TIME DATE DEFAULT SYSDATE																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table AQA0006_EAPPS_TRANSACTION_20230428																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."AQA0006_EAPPS_TRANSACTION_20230428"																																							
(	AQA0006_SECURITY_CODE CHAR(8 BYTE),																																						
	AQA0006_ISSUE_NO VARCHAR2(3 BYTE),																																						
	AQA0006_REFERENCE_NO NUMBER(5,0),																																						
	AQA0006_RECEIVED_DATE DATE,																																						
	AQA0006_RECEIVED_TIME DATE,																																						
	AQA0006_USER_ID VARCHAR2(8 BYTE),																																						
	AQA0006_TRANS_TYPE CHAR(3 BYTE),																																						
	AQA0006_NOMINAL_AMT1 NUMBER(16,0),																																						
	AQA0006_COMPETITIVE_CHECK1 CHAR(1 BYTE),																																						
	AQA0006_YIELD1 NUMBER(3,2),																																						
	AQA0006_NOMINAL_AMT2 NUMBER(16,0),																																						
	AQA0006_COMPETITIVE_CHECK2 CHAR(1 BYTE),																																						
	AQA0006_YIELD2 NUMBER(3,2),																																						
	AQA0006_NOMINAL_AMT3 NUMBER(16,0),																																						
	AQA0006_COMPETITIVE_CHECK3 CHAR(1 BYTE),																																						
	AQA0006_YIELD3 NUMBER(3,2),																																						
	AQA0006_NOMINAL_AMT4 NUMBER(16,0),																																						
	AQA0006_COMPETITIVE_CHECK4 CHAR(1 BYTE),																																						
	AQA0006_YIELD4 NUMBER(3,2),																																						
	AQA0006_NOMINAL_AMT5 NUMBER(16,0),																																						
	AQA0006_COMPETITIVE_CHECK5 CHAR(1 BYTE),																																						
	AQA0006_YIELD5 NUMBER(3,2),																																						
	AQA0006_NAME_OF_APPLICANT VARCHAR2(30 BYTE),																																						
	AQA0006_NATIONALITY CHAR(1 BYTE),																																						
	AQA0006_NRIC_NO VARCHAR2(14 BYTE),																																						
	AQA0006_CPF_ACC_NO CHAR(9 BYTE),																																						
	AQA0006_BANK_ACC_CODE NUMBER(4,0),																																						
	AQA0006_SETTLEMENT_BANK_CODE NUMBER(4,0),																																						
	AQA0006_BANK_OR_CUSTODIAN CHAR(1 BYTE),																																						
	AQA0006_TYPE_OF_APPLICANT VARCHAR2(3 BYTE),																																						
	AQA0006_REC_STATUS CHAR(1 BYTE),																																						
	AQA0006_CHECKSUM NUMBER(14,0),																																						
	AQA0006_UPDATED_TIME DATE																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP" ;																																							
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
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP" ;																																							
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
TABLESPACE "NETAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table FINAL_DAILY_PRICE																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."FINAL_DAILY_PRICE"																																							
(	ABA0017_SECURITY_CODE CHAR(8 BYTE),																																						
	ABA0017_ISSUE_NO CHAR(1 BYTE),																																						
	ABA0017_SUBMISSION_DATE DATE,																																						
	ABA0017_HIGH_PRICE NUMBER(7,4) DEFAULT 0,																																						
	ABA0017_LOW_PRICE NUMBER(7,4) DEFAULT 0,																																						
	ABA0017_AVE_PRICE NUMBER(7,4) DEFAULT 0,																																						
	ABA0017_DIRTY_PRICE NUMBER(7,4) DEFAULT 0,																																						
	ABA0017_MLA_PRICE NUMBER(7,4) DEFAULT 0,																																						
	ABA0017_YIELD NUMBER(7,4) DEFAULT 0,																																						
	ABA0017_UPDATE_TIME DATE DEFAULT SYSDATE,																																						
	ABA0017_T1_DATE DATE,																																						
	ABA0017_T1_DIRTY_PRICE NUMBER(7,4) DEFAULT 0,																																						
	ABA0017_REPOT1_DATE DATE,																																						
	ABA0017_REPOT1_DIRTY_PRICE NUMBER(7,4) DEFAULT 0,																																						
	ABA0017_T2_DATE DATE,																																						
	ABA0017_REPOT2_DATE DATE,																																						
	ABA0017_REPOT2_DIRTY_PRICE NUMBER(7,4) DEFAULT 0,																																						
	ABA0017_BENCH_HIGH_PRICE NUMBER(7,4) DEFAULT 0,																																						
	ABA0017_BENCH_LOW_PRICE NUMBER(7,4) DEFAULT 0,																																						
	ABA0017_MODIFIED_DURATION NUMBER(8,4) DEFAULT 0,																																						
	ABA0017_BENCH_PRICE_FLAG VARCHAR2(1 BYTE)																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table FX_FACTORS																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."FX_FACTORS"																																							
(	BASE_CURRENCY VARCHAR2(20 BYTE),																																						
	FACTORS NUMBER																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table MLOG$_ABA0001_SECURITY_MAS																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."MLOG$_ABA0001_SECURITY_MAS"																																							
(	M_ROW$$ VARCHAR2(255 BYTE),																																						
	SNAPTIME$$ DATE,																																						
	DMLTYPE$$ VARCHAR2(1 BYTE),																																						
	OLD_NEW$$ VARCHAR2(1 BYTE),																																						
	CHANGE_VECTOR$$ RAW(255)																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 60 PCTUSED 30 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 11534336 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP" ;																																							
																																							
COMMENT ON TABLE "MS9ABA"."MLOG$_ABA0001_SECURITY_MAS"  IS 'snapshot log for master table MS9ABA.ABA0001_SECURITY_MASTER';																																							
--------------------------------------------------------																																							
--  DDL for Table MLOG$_ABA0017_FINAL_DAILY_																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."MLOG$_ABA0017_FINAL_DAILY_"																																							
(	M_ROW$$ VARCHAR2(255 BYTE),																																						
	SNAPTIME$$ DATE,																																						
	DMLTYPE$$ VARCHAR2(1 BYTE),																																						
	OLD_NEW$$ VARCHAR2(1 BYTE),																																						
	CHANGE_VECTOR$$ RAW(255)																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 60 PCTUSED 30 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 133169152 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP" ;																																							
																																							
COMMENT ON TABLE "MS9ABA"."MLOG$_ABA0017_FINAL_DAILY_"  IS 'snapshot log for master table MS9ABA.ABA0017_FINAL_DAILY_PRICE';																																							
--------------------------------------------------------																																							
--  DDL for Table MLOG$_ABA0018_FINAL_EXTRA_																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."MLOG$_ABA0018_FINAL_EXTRA_"																																							
(	M_ROW$$ VARCHAR2(255 BYTE),																																						
	SNAPTIME$$ DATE,																																						
	DMLTYPE$$ VARCHAR2(1 BYTE),																																						
	OLD_NEW$$ VARCHAR2(1 BYTE),																																						
	CHANGE_VECTOR$$ RAW(255)																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 60 PCTUSED 30 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 2097152 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP" ;																																							
																																							
COMMENT ON TABLE "MS9ABA"."MLOG$_ABA0018_FINAL_EXTRA_"  IS 'snapshot log for master table MS9ABA.ABA0018_FINAL_EXTRA_PRICE';																																							
--------------------------------------------------------																																							
--  DDL for Table TEMP																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."TEMP"																																							
(	C1 VARCHAR2(50 BYTE),																																						
	COLUMN2 VARCHAR2(50 BYTE)																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table TEMP1																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."TEMP1"																																							
(	C1 VARCHAR2(50 BYTE),																																						
	COLUMN2 VARCHAR2(50 BYTE)																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table TEMP_SUBSCRIPTION_ENTRY																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."TEMP_SUBSCRIPTION_ENTRY"																																							
(	FILE_TYPE VARCHAR2(3 BYTE),																																						
	PRI_DLR_CODE NUMBER(4,0),																																						
	BANK_NAME VARCHAR2(20 BYTE),																																						
	PROCESSING_DATE DATE,																																						
	ISSUE_CODE VARCHAR2(8 BYTE),																																						
	ISIN_CODE VARCHAR2(12 BYTE),																																						
	TENDER_DATE DATE,																																						
	CURR VARCHAR2(3 BYTE),																																						
	ISSUE_DESC VARCHAR2(30 BYTE),																																						
	TRANS_REF VARCHAR2(8 BYTE),																																						
	RECEIVED_DATE_TIME DATE,																																						
	TRANS_TYPE VARCHAR2(3 BYTE),																																						
	NOMINAL_AMT NUMBER(11,0),																																						
	COMP_NOCOMP VARCHAR2(1 BYTE),																																						
	BID_YIELD_SIGN VARCHAR2(1 BYTE),																																						
	BID_YIELD NUMBER(6,2),																																						
	NAME_OF_APPLN VARCHAR2(100 BYTE),																																						
	NATIONALITY VARCHAR2(1 BYTE),																																						
	NATIONALITY_COUNTRY VARCHAR2(2 BYTE),																																						
	IC_PASSPORT VARCHAR2(14 BYTE),																																						
	CUST_BANK_CODE NUMBER(4,0),																																						
	CUST_BANK_BC VARCHAR2(1 BYTE),																																						
	TYPE_OF_APPLN VARCHAR2(3 BYTE),																																						
	REC_STATUS VARCHAR2(1 BYTE),																																						
	CDP_ACCT_NO VARCHAR2(16 BYTE),																																						
	SUB_METHOD VARCHAR2(1 BYTE),																																						
	CPFIS_ACCT_NO VARCHAR2(16 BYTE),																																						
	FILLER VARCHAR2(20 BYTE)																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Table TEST_CLOB																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."TEST_CLOB"																																							
(	ID NUMBER(15,0),																																						
	DOCUMENT_NAME VARCHAR2(1000 BYTE),																																						
	XML_DOCUMENT CLOB,																																						
	TIMESTAMP DATE																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP"																																							
LOB ("XML_DOCUMENT") STORE AS BASICFILE (																																							
TABLESPACE "NETAPP" ENABLE STORAGE IN ROW CHUNK 8192 RETENTION																																							
NOCACHE LOGGING																																							
STORAGE(INITIAL 65536 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)) ;																																							
--------------------------------------------------------																																							
--  DDL for Table USER_SESSION																																							
--------------------------------------------------------																																							
																																							
CREATE TABLE "MS9ABA"."USER_SESSION"																																							
(	USER_ID VARCHAR2(100 BYTE),																																						
	SESSION_ID VARCHAR2(100 BYTE),																																						
	LAST_LOGIN_DATE DATE																																						
) SEGMENT CREATION IMMEDIATE																																							
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255																																							
NOCOMPRESS LOGGING																																							
STORAGE(INITIAL 2097152 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for View ABA0604_TRADE_SUMMARY_VIEW																																							
--------------------------------------------------------																																							
																																							
CREATE OR REPLACE FORCE EDITIONABLE VIEW "MS9ABA"."ABA0604_TRADE_SUMMARY_VIEW" ("RECV_DATE", "RECV_DATE2", "SETTLE_DATE", "SEC_CODE", "AMT_APPLIED", "AMT_ALLOT", "CLEAN_PRICE", "HC_CLEAN_PRICE", "DIRTY_PRICE", "HC_DIRTY_PRICE", "SDURATION", "GDURATION") AS																																							
SELECT																																							
recv_date,																																							
recv_date2,																																							
settle_date,																																							
sec_code,																																							
amt_applied,																																							
amt_allot,																																							
clean_price,																																							
hc_clean_price,																																							
dirty_price,																																							
hc_dirty_price,																																							
sduration,																																							
gduration																																							
FROM																																							
(																																							
(SELECT																																							
MIN(SEC_CODE) AS sec_code,																																							
SUM(AMT_APPLIED) AS amt_applied,																																							
SUM(AMT_ALLOT) AS amt_allot,																																							
MIN(HC_CLEAN_PRICE) AS hc_clean_price,																																							
MIN(CLEAN_PRICE) AS clean_price,																																							
MIN(HC_DIRTY_PRICE) AS hc_dirty_price,																																							
MIN(DIRTY_PRICE) AS dirty_price,																																							
MIN(SDURATION) AS sduration,																																							
MIN(GDURATION) AS gduration,																																							
MIN(RECV_DATE2) AS recv_date2,																																							
MIN(RECV_DATE) AS recv_date,																																							
MIN(SETTLE_DATE) AS settle_date																																							
FROM ABA0604_TRD_SUM_MASTER_VIEW																																							
		GROUP BY TO_CHAR(RECV_DATE, 'yyyymmdd'), SEC_CODE																																					
		)																																					
		UNION ALL																																					
		(																																					
		SELECT																																					
MIN(SEC_CODE) AS sec_code,																																							
SUM(AMT_APPLIED) AS amt_applied,																																							
SUM(AMT_ALLOT) AS amt_allot,																																							
MIN(HC_CLEAN_PRICE) AS hc_clean_price,																																							
MIN(CLEAN_PRICE) AS clean_price,																																							
MIN(HC_DIRTY_PRICE) AS hc_dirty_price,																																							
MIN(DIRTY_PRICE) AS dirty_price,																																							
MIN(SDURATION) AS sduration,																																							
MIN(GDURATION) AS gduration,																																							
MIN(RECV_DATE2) AS recv_date2,																																							
MIN(RECV_DATE) AS recv_date,																																							
MIN(SETTLE_DATE) AS settle_date																																							
FROM ABA0604_TRD_SUM_MASTER_VIEW																																							
		GROUP BY TO_CHAR(RECV_DATE, 'yyyymmdd'), SEC_CODE																																					
		)																																					
		UNION ALL																																					
		(																																					
		SELECT																																					
MIN(SEC_CODE) AS sec_code,																																							
SUM(AMT_APPLIED) AS amt_applied,																																							
SUM(AMT_ALLOT) AS amt_allot,																																							
MIN(HC_CLEAN_PRICE) AS hc_clean_price,																																							
MIN(CLEAN_PRICE) AS clean_price,																																							
MIN(HC_DIRTY_PRICE) AS hc_dirty_price,																																							
MIN(DIRTY_PRICE) AS dirty_price,																																							
MIN(SDURATION) AS sduration,																																							
MIN(GDURATION) AS gduration,																																							
MIN(RECV_DATE2) AS recv_date2,																																							
MIN(RECV_DATE) AS recv_date,																																							
MIN(SETTLE_DATE) AS settle_date																																							
FROM ABA0604_TRD_SUM_MASTER_VIEW																																							
		GROUP BY TO_CHAR(RECV_DATE, 'yyyymmdd'), SEC_CODE																																					
		)																																					
		UNION ALL																																					
		(																																					
		SELECT																																					
MIN(SEC_CODE) AS sec_code,																																							
SUM(AMT_APPLIED) AS amt_applied,																																							
SUM(AMT_ALLOT) AS amt_allot,																																							
MIN(HC_CLEAN_PRICE) AS hc_clean_price,																																							
MIN(CLEAN_PRICE) AS clean_price,																																							
MIN(HC_DIRTY_PRICE) AS hc_dirty_price,																																							
MIN(DIRTY_PRICE) AS dirty_price,																																							
MIN(SDURATION) AS sduration,																																							
MIN(GDURATION) AS gduration,																																							
MIN(RECV_DATE2) AS recv_date2,																																							
MIN(RECV_DATE) AS recv_date,																																							
MIN(SETTLE_DATE) AS settle_date																																							
FROM ABA0604_TRD_SUM_MASTER_VIEW																																							
		GROUP BY TO_CHAR(RECV_DATE, 'yyyymmdd'), SEC_CODE																																					
		)																																					
		UNION ALL																																					
		(																																					
		SELECT																																					
MIN(SEC_CODE) AS sec_code,																																							
SUM(AMT_APPLIED) AS amt_applied,																																							
SUM(AMT_ALLOT) AS amt_allot,																																							
MIN(HC_CLEAN_PRICE) AS hc_clean_price,																																							
MIN(CLEAN_PRICE) AS clean_price,																																							
MIN(HC_DIRTY_PRICE) AS hc_dirty_price,																																							
MIN(DIRTY_PRICE) AS dirty_price,																																							
MIN(SDURATION) AS sduration,																																							
MIN(GDURATION) AS gduration,																																							
MIN(RECV_DATE2) AS recv_date2,																																							
MIN(RECV_DATE) AS recv_date,																																							
MIN(SETTLE_DATE) AS settle_date																																							
FROM ABA0604_TRD_SUM_MASTER_VIEW																																							
		GROUP BY TO_CHAR(RECV_DATE, 'yyyymmdd'), SEC_CODE																																					
		)																																					
		UNION ALL																																					
		(																																					
		SELECT																																					
MIN(SEC_CODE) AS sec_code,																																							
SUM(AMT_APPLIED) AS amt_applied,																																							
SUM(AMT_ALLOT) AS amt_allot,																																							
MIN(HC_CLEAN_PRICE) AS hc_clean_price,																																							
MIN(CLEAN_PRICE) AS clean_price,																																							
MIN(HC_DIRTY_PRICE) AS hc_dirty_price,																																							
MIN(DIRTY_PRICE) AS dirty_price,																																							
MIN(SDURATION) AS sduration,																																							
MIN(GDURATION) AS gduration,																																							
MIN(RECV_DATE2) AS recv_date2,																																							
MIN(RECV_DATE) AS recv_date,																																							
MIN(SETTLE_DATE) AS settle_date																																							
FROM ABA0604_TRD_SUM_MASTER_VIEW																																							
		GROUP BY TO_CHAR(RECV_DATE, 'yyyymmdd'), SEC_CODE																																					
		)																																					
		UNION ALL																																					
		(																																					
		SELECT																																					
MIN(SEC_CODE) AS sec_code,																																							
SUM(AMT_APPLIED) AS amt_applied,																																							
SUM(AMT_ALLOT) AS amt_allot,																																							
MIN(HC_CLEAN_PRICE) AS hc_clean_price,																																							
MIN(CLEAN_PRICE) AS clean_price,																																							
MIN(HC_DIRTY_PRICE) AS hc_dirty_price,																																							
MIN(DIRTY_PRICE) AS dirty_price,																																							
MIN(SDURATION) AS sduration,																																							
MIN(GDURATION) AS gduration,																																							
MIN(RECV_DATE2) AS recv_date2,																																							
MIN(RECV_DATE) AS recv_date,																																							
MIN(SETTLE_DATE) AS settle_date																																							
FROM ABA0604_TRD_SUM_MASTER_VIEW																																							
		GROUP BY TO_CHAR(RECV_DATE, 'yyyymmdd'), SEC_CODE																																					
		)																																					
		UNION ALL																																					
		(																																					
		SELECT																																					
MIN(SEC_CODE) AS sec_code,																																							
SUM(AMT_APPLIED) AS amt_applied,																																							
SUM(AMT_ALLOT) AS amt_allot,																																							
MIN(HC_CLEAN_PRICE) AS hc_clean_price,																																							
MIN(CLEAN_PRICE) AS clean_price,																																							
MIN(HC_DIRTY_PRICE) AS hc_dirty_price,																																							
MIN(DIRTY_PRICE) AS dirty_price,																																							
MIN(SDURATION) AS sduration,																																							
MIN(GDURATION) AS gduration,																																							
MIN(RECV_DATE2) AS recv_date2,																																							
MIN(RECV_DATE) AS recv_date,																																							
MIN(SETTLE_DATE) AS settle_date																																							
FROM ABA0604_TRD_SUM_MASTER_VIEW																																							
		GROUP BY TO_CHAR(RECV_DATE, 'yyyymmdd'), SEC_CODE																																					
		)																																					
		UNION ALL																																					
		(																																					
		SELECT																																					
MIN(SEC_CODE) AS sec_code,																																							
SUM(AMT_APPLIED) AS amt_applied,																																							
SUM(AMT_ALLOT) AS amt_allot,																																							
MIN(HC_CLEAN_PRICE) AS hc_clean_price,																																							
MIN(CLEAN_PRICE) AS clean_price,																																							
MIN(HC_DIRTY_PRICE) AS hc_dirty_price,																																							
MIN(DIRTY_PRICE) AS dirty_price,																																							
MIN(SDURATION) AS sduration,																																							
MIN(GDURATION) AS gduration,																																							
MIN(RECV_DATE2) AS recv_date2,																																							
MIN(RECV_DATE) AS recv_date,																																							
MIN(SETTLE_DATE) AS settle_date																																							
FROM ABA0604_TRD_SUM_MASTER_VIEW																																							
		GROUP BY TO_CHAR(RECV_DATE, 'yyyymmdd'), SEC_CODE																																					
		)																																					
		UNION ALL																																					
		(																																					
		SELECT																																					
MIN(SEC_CODE) AS sec_code,																																							
SUM(AMT_APPLIED) AS amt_applied,																																							
SUM(AMT_ALLOT) AS amt_allot,																																							
MIN(HC_CLEAN_PRICE) AS hc_clean_price,																																							
MIN(CLEAN_PRICE) AS clean_price,																																							
MIN(HC_DIRTY_PRICE) AS hc_dirty_price,																																							
MIN(DIRTY_PRICE) AS dirty_price,																																							
MIN(SDURATION) AS sduration,																																							
MIN(GDURATION) AS gduration,																																							
MIN(RECV_DATE2) AS recv_date2,																																							
MIN(RECV_DATE) AS recv_date,																																							
MIN(SETTLE_DATE) AS settle_date																																							
FROM ABA0604_TRD_SUM_MASTER_VIEW																																							
		GROUP BY TO_CHAR(RECV_DATE, 'yyyymmdd'), SEC_CODE																																					
		)																																					
		UNION ALL																																					
		(																																					
		SELECT																																					
MIN(SEC_CODE) AS sec_code,																																							
SUM(AMT_APPLIED) AS amt_applied,																																							
SUM(AMT_ALLOT) AS amt_allot,																																							
MIN(HC_CLEAN_PRICE) AS hc_clean_price,																																							
MIN(CLEAN_PRICE) AS clean_price,																																							
MIN(HC_DIRTY_PRICE) AS hc_dirty_price,																																							
MIN(DIRTY_PRICE) AS dirty_price,																																							
MIN(SDURATION) AS sduration,																																							
MIN(GDURATION) AS gduration,																																							
MIN(RECV_DATE2) AS recv_date2,																																							
MIN(RECV_DATE) AS recv_date,																																							
MIN(SETTLE_DATE) AS settle_date																																							
FROM ABA0604_TRD_SUM_MASTER_VIEW																																							
		GROUP BY TO_CHAR(RECV_DATE, 'yyyymmdd'), SEC_CODE																																					
		)																																					
		UNION ALL																																					
		(																																					
		SELECT																																					
MIN(SEC_CODE) AS sec_code,																																							
SUM(AMT_APPLIED) AS amt_applied,																																							
SUM(AMT_ALLOT) AS amt_allot,																																							
MIN(HC_CLEAN_PRICE) AS hc_clean_price,																																							
MIN(CLEAN_PRICE) AS clean_price,																																							
MIN(HC_DIRTY_PRICE) AS hc_dirty_price,																																							
MIN(DIRTY_PRICE) AS dirty_price,																																							
MIN(SDURATION) AS sduration,																																							
MIN(GDURATION) AS gduration,																																							
MIN(RECV_DATE2) AS recv_date2,																																							
MIN(RECV_DATE) AS recv_date,																																							
MIN(SETTLE_DATE) AS settle_date																																							
FROM ABA0604_TRD_SUM_MASTER_VIEW																																							
		GROUP BY TO_CHAR(RECV_DATE, 'yyyymmdd'), SEC_CODE																																					
		)																																					
		UNION ALL																																					
		(																																					
		SELECT																																					
MIN(SEC_CODE) AS sec_code,																																							
SUM(AMT_APPLIED) AS amt_applied,																																							
SUM(AMT_ALLOT) AS amt_allot,																																							
MIN(HC_CLEAN_PRICE) AS hc_clean_price,																																							
MIN(CLEAN_PRICE) AS clean_price,																																							
MIN(HC_DIRTY_PRICE) AS hc_dirty_price,																																							
MIN(DIRTY_PRICE) AS dirty_price,																																							
MIN(SDURATION) AS sduration,																																							
MIN(GDURATION) AS gduration,																																							
MIN(RECV_DATE2) AS recv_date2,																																							
MIN(RECV_DATE) AS recv_date,																																							
MIN(SETTLE_DATE) AS settle_date																																							
FROM ABA0604_TRD_SUM_MASTER_VIEW																																							
		GROUP BY TO_CHAR(RECV_DATE, 'yyyymmdd'), SEC_CODE																																					
		)																																					
		UNION ALL																																					
		(																																					
		SELECT																																					
MIN(SEC_CODE) AS sec_code,																																							
SUM(AMT_APPLIED) AS amt_applied,																																							
SUM(AMT_ALLOT) AS amt_allot,																																							
MIN(HC_CLEAN_PRICE) AS hc_clean_price,																																							
MIN(CLEAN_PRICE) AS clean_price,																																							
MIN(HC_DIRTY_PRICE) AS hc_dirty_price,																																							
MIN(DIRTY_PRICE) AS dirty_price,																																							
MIN(SDURATION) AS sduration,																																							
MIN(GDURATION) AS gduration,																																							
MIN(RECV_DATE2) AS recv_date2,																																							
MIN(RECV_DATE) AS recv_date,																																							
MIN(SETTLE_DATE) AS settle_date																																							
FROM ABA0604_TRD_SUM_MASTER_VIEW																																							
		GROUP BY TO_CHAR(RECV_DATE, 'yyyymmdd'), SEC_CODE																																					
		)																																					
		UNION ALL																																					
		(																																					
		SELECT																																					
MIN(SEC_CODE) AS sec_code,																																							
SUM(AMT_APPLIED) AS amt_applied,																																							
SUM(AMT_ALLOT) AS amt_allot,																																							
MIN(HC_CLEAN_PRICE) AS hc_clean_price,																																							
MIN(CLEAN_PRICE) AS clean_price,																																							
MIN(HC_DIRTY_PRICE) AS hc_dirty_price,																																							
MIN(DIRTY_PRICE) AS dirty_price,																																							
MIN(SDURATION) AS sduration,																																							
MIN(GDURATION) AS gduration,																																							
MIN(RECV_DATE2) AS recv_date2,																																							
MIN(RECV_DATE) AS recv_date,																																							
MIN(SETTLE_DATE) AS settle_date																																							
FROM ABA0604_TRD_SUM_MASTER_VIEW																																							
		GROUP BY TO_CHAR(RECV_DATE, 'yyyymmdd'), SEC_CODE																																					
		)																																					
		UNION ALL																																					
		(																																					
		SELECT																																					
MIN(SEC_CODE) AS sec_code,																																							
SUM(AMT_APPLIED) AS amt_applied,																																							
SUM(AMT_ALLOT) AS amt_allot,																																							
MIN(HC_CLEAN_PRICE) AS hc_clean_price,																																							
MIN(CLEAN_PRICE) AS clean_price,																																							
MIN(HC_DIRTY_PRICE) AS hc_dirty_price,																																							
MIN(DIRTY_PRICE) AS dirty_price,																																							
MIN(SDURATION) AS sduration,																																							
MIN(GDURATION) AS gduration,																																							
MIN(RECV_DATE2) AS recv_date2,																																							
MIN(RECV_DATE) AS recv_date,																																							
MIN(SETTLE_DATE) AS settle_date																																							
FROM ABA0604_TRD_SUM_MASTER_VIEW																																							
		GROUP BY TO_CHAR(RECV_DATE, 'yyyymmdd'), SEC_CODE																																					
		)																																					
		UNION ALL																																					
		(																																					
		SELECT																																					
MIN(SEC_CODE) AS sec_code,																																							
SUM(AMT_APPLIED) AS amt_applied,																																							
SUM(AMT_ALLOT) AS amt_allot,																																							
MIN(HC_CLEAN_PRICE) AS hc_clean_price,																																							
MIN(CLEAN_PRICE) AS clean_price,																																							
MIN(HC_DIRTY_PRICE) AS hc_dirty_price,																																							
MIN(DIRTY_PRICE) AS dirty_price,																																							
MIN(SDURATION) AS sduration,																																							
MIN(GDURATION) AS gduration,																																							
MIN(RECV_DATE2) AS recv_date2,																																							
MIN(RECV_DATE) AS recv_date,																																							
MIN(SETTLE_DATE) AS settle_date																																							
FROM ABA0604_TRD_SUM_MASTER_VIEW																																							
		GROUP BY TO_CHAR(RECV_DATE, 'yyyymmdd'), SEC_CODE																																					
		)																																					
		UNION ALL																																					
		(																																					
		SELECT																																					
MIN(SEC_CODE) AS sec_code,																																							
SUM(AMT_APPLIED) AS amt_applied,																																							
SUM(AMT_ALLOT) AS amt_allot,																																							
MIN(HC_CLEAN_PRICE) AS hc_clean_price,																																							
MIN(CLEAN_PRICE) AS clean_price,																																							
MIN(HC_DIRTY_PRICE) AS hc_dirty_price,																																							
MIN(DIRTY_PRICE) AS dirty_price,																																							
MIN(SDURATION) AS sduration,																																							
MIN(GDURATION) AS gduration,																																							
MIN(RECV_DATE2) AS recv_date2,																																							
MIN(RECV_DATE) AS recv_date,																																							
MIN(SETTLE_DATE) AS settle_date																																							
FROM ABA0604_TRD_SUM_MASTER_VIEW																																							
		GROUP BY TO_CHAR(RECV_DATE, 'yyyymmdd'), SEC_CODE																																					
		)																																					
		UNION ALL																																					
		(																																					
		SELECT																																					
MIN(SEC_CODE) AS sec_code,																																							
SUM(AMT_APPLIED) AS amt_applied,																																							
SUM(AMT_ALLOT) AS amt_allot,																																							
MIN(HC_CLEAN_PRICE) AS hc_clean_price,																																							
MIN(CLEAN_PRICE) AS clean_price,																																							
MIN(HC_DIRTY_PRICE) AS hc_dirty_price,																																							
MIN(DIRTY_PRICE) AS dirty_price,																																							
MIN(SDURATION) AS sduration,																																							
MIN(GDURATION) AS gduration,																																							
MIN(RECV_DATE2) AS recv_date2,																																							
MIN(RECV_DATE) AS recv_date,																																							
MIN(SETTLE_DATE) AS settle_date																																							
FROM ABA0604_TRD_SUM_MASTER_VIEW																																							
		GROUP BY TO_CHAR(RECV_DATE, 'yyyymmdd'), SEC_CODE																																					
		)																																					
		UNION ALL																																					
		(																																					
		SELECT																																					
MIN(SEC_CODE) AS sec_code,																																							
SUM(AMT_APPLIED) AS amt_applied,																																							
SUM(AMT_ALLOT) AS amt_allot,																																							
MIN(HC_CLEAN_PRICE) AS hc_clean_price,																																							
MIN(CLEAN_PRICE) AS clean_price,																																							
MIN(HC_DIRTY_PRICE) AS hc_dirty_price,																																							
MIN(DIRTY_PRICE) AS dirty_price,																																							
MIN(SDURATION) AS sduration,																																							
MIN(GDURATION) AS gduration,																																							
MIN(RECV_DATE2) AS recv_date2,																																							
MIN(RECV_DATE) AS recv_date,																																							
MIN(SETTLE_DATE) AS settle_date																																							
FROM ABA0604_TRD_SUM_MASTER_VIEW																																							
		GROUP BY TO_CHAR(RECV_DATE, 'yyyymmdd'), SEC_CODE																																					
		)																																					
		UNION ALL																																					
		(																																					
		SELECT																																					
MIN(SEC_CODE) AS sec_code,																																							
SUM(AMT_APPLIED) AS amt_applied,																																							
SUM(AMT_ALLOT) AS amt_allot,																																							
MIN(HC_CLEAN_PRICE) AS hc_clean_price,																																							
MIN(CLEAN_PRICE) AS clean_price,																																							
MIN(HC_DIRTY_PRICE) AS hc_dirty_price,																																							
MIN(DIRTY_PRICE) AS dirty_price,																																							
MIN(SDURATION) AS sduration,																																							
MIN(GDURATION) AS gduration,																																							
MIN(RECV_DATE2) AS recv_date2,																																							
MIN(RECV_DATE) AS recv_date,																																							
MIN(SETTLE_DATE) AS settle_date																																							
FROM ABA0604_TRD_SUM_MASTER_VIEW																																							
		GROUP BY TO_CHAR(RECV_DATE, 'yyyymmdd'), SEC_CODE																																					
		)																																					
		UNION ALL																																					
		(																																					
		SELECT																																					
MIN(SEC_CODE) AS sec_code,																																							
SUM(AMT_APPLIED) AS amt_applied,																																							
SUM(AMT_ALLOT) AS amt_allot,																																							
MIN(HC_CLEAN_PRICE) AS hc_clean_price,																																							
MIN(CLEAN_PRICE) AS clean_price,																																							
MIN(HC_DIRTY_PRICE) AS hc_dirty_price,																																							
MIN(DIRTY_PRICE) AS dirty_price,																																							
MIN(SDURATION) AS sduration,																																							
MIN(GDURATION) AS gduration,																																							
MIN(RECV_DATE2) AS recv_date2,																																							
MIN(RECV_DATE) AS recv_date,																																							
MIN(SETTLE_DATE) AS settle_date																																							
FROM ABA0604_TRD_SUM_MASTER_VIEW																																							
		GROUP BY TO_CHAR(RECV_DATE, 'yyyymmdd'), SEC_CODE																																					
		)																																					
		UNION ALL																																					
		(																																					
		SELECT																																					
MIN(SEC_CODE) AS sec_code,																																							
SUM(AMT_APPLIED) AS amt_applied,																																							
SUM(AMT_ALLOT) AS amt_allot,																																							
MIN(HC_CLEAN_PRICE) AS hc_clean_price,																																							
MIN(CLEAN_PRICE) AS clean_price,																																							
MIN(HC_DIRTY_PRICE) AS hc_dirty_price,																																							
MIN(DIRTY_PRICE) AS dirty_price,																																							
MIN(SDURATION) AS sduration,																																							
MIN(GDURATION) AS gduration,																																							
MIN(RECV_DATE2) AS recv_date2,																																							
MIN(RECV_DATE) AS recv_date,																																							
MIN(SETTLE_DATE) AS settle_date																																							
FROM ABA0604_TRD_SUM_MASTER_VIEW																																							
		GROUP BY TO_CHAR(RECV_DATE, 'yyyymmdd'), SEC_CODE																																					
		)																																					
)																																							
;																																							
--------------------------------------------------------																																							
--  DDL for View ABA0604_TRADE_SUMMARY_VW_TEST																																							
--------------------------------------------------------																																							
																																							
CREATE OR REPLACE FORCE EDITIONABLE VIEW "MS9ABA"."ABA0604_TRADE_SUMMARY_VW_TEST" ("RECV_DATE", "RECV_DATE2", "SETTLE_DATE", "SEC_CODE", "AMT_APPLIED", "AMT_ALLOT", "CLEAN_PRICE", "HC_CLEAN_PRICE", "DIRTY_PRICE", "HC_DIRTY_PRICE", "SDURATION", "GDURATION") AS																																							
SELECT DISTINCT recv_date,																																							
recv_date2,																																							
settle_date,																																							
sec_code,																																							
amt_applied,																																							
amt_allot,																																							
clean_price,																																							
hc_clean_price,																																							
dirty_price,																																							
hc_dirty_price,																																							
sduration,																																							
gduration																																							
FROM																																							
(SELECT DISTINCT aba0603_security_code AS sec_code,																																							
aba0603_opened_dt                    AS recv_date																																							
FROM aba0603_open_issues																																							
WHERE aba0603_voided <> 'Y'																																							
) OUTER																																							
LEFT JOIN																																							
(SELECT DISTINCT *																																							
FROM																																							
(SELECT MIN(aba0605_security_code) AS sec_code2,																																							
SUM(aba0605_amt_applied)         AS amt_applied,																																							
SUM(aba0605_amt_allotted)        AS amt_allot,																																							
MIN(aba0605_haircut_clean_price) AS hc_clean_price,																																							
MIN(aba0605_clean_price)         AS clean_price,																																							
MIN(aba0605_haircut_dirty_price) AS hc_dirty_price ,																																							
MIN(aba0605_dirty_price)         AS dirty_price,																																							
MIN(aba0605_s_duration)          AS sduration,																																							
MIN(aba0605_g_duration)          AS gduration,																																							
MIN(aba0605_received_dt)         AS recv_date2																																							
FROM aba0605_trade_details																																							
WHERE (aba0605_status_flag='A'																																							
OR aba0605_status_flag    ='C')																																							
GROUP BY TO_CHAR(aba0605_received_dt,'yyyymmdd'),																																							
aba0605_security_code																																							
) OUTER																																							
LEFT JOIN																																							
(SELECT aba0017_submission_date,																																							
aba0017_t1_date AS settle_date																																							
FROM aba0017_final_daily_price																																							
)																																							
ON TO_CHAR(aba0017_submission_date,'yyyymmdd') = TO_CHAR(recv_date2,'yyyymmdd')																																							
) ON sec_code2                                 =sec_code																																							
AND TO_CHAR(recv_date,'yyyymmdd')                = TO_CHAR(recv_date2,'yyyymmdd')																																							
ORDER BY recv_date,																																							
recv_date2																																							
;																																							
--------------------------------------------------------																																							
--  DDL for View ABA0604_TRD_SUM_MASTER_VIEW																																							
--------------------------------------------------------																																							
																																							
CREATE OR REPLACE FORCE EDITIONABLE VIEW "MS9ABA"."ABA0604_TRD_SUM_MASTER_VIEW" ("RECV_DATE", "RECV_DATE2", "SETTLE_DATE", "SEC_CODE", "AMT_APPLIED", "AMT_ALLOT", "CLEAN_PRICE", "HC_CLEAN_PRICE", "DIRTY_PRICE", "HC_DIRTY_PRICE", "SDURATION", "GDURATION", "STATUS_FLAG") AS																																							
SELECT DISTINCT recv_date,																																							
recv_date2,																																							
settle_date,																																							
sec_code,																																							
amt_applied,																																							
amt_allot,																																							
clean_price,																																							
hc_clean_price,																																							
dirty_price,																																							
hc_dirty_price,																																							
sduration,																																							
gduration,																																							
status_flag																																							
FROM																																							
(SELECT DISTINCT aba0603_security_code AS sec_code,																																							
aba0603_opened_dt                    AS recv_date																																							
FROM aba0603_open_issues																																							
WHERE aba0603_voided <> 'Y'																																							
) OUTER																																							
LEFT JOIN																																							
(SELECT DISTINCT *																																							
FROM																																							
(SELECT MIN(aba0605_security_code) AS sec_code2,																																							
SUM(aba0605_amt_applied)         AS amt_applied,																																							
SUM(aba0605_amt_allotted)        AS amt_allot,																																							
MIN(aba0605_haircut_clean_price) AS hc_clean_price,																																							
MIN(aba0605_clean_price)         AS clean_price,																																							
MIN(aba0605_haircut_dirty_price) AS hc_dirty_price ,																																							
MIN(aba0605_dirty_price)         AS dirty_price,																																							
MIN(aba0605_s_duration)          AS sduration,																																							
MIN(aba0605_g_duration)          AS gduration,																																							
MIN(aba0605_received_dt)         AS recv_date2,																																							
aba0605_status_flag              AS status_flag																																							
FROM aba0605_trade_details																																							
WHERE (aba0605_status_flag='A'																																							
OR aba0605_status_flag    ='C')																																							
GROUP BY TO_CHAR(aba0605_received_dt,'yyyymmdd'),																																							
aba0605_security_code,																																							
aba0605_status_flag																																							
) OUTER																																							
LEFT JOIN																																							
(SELECT aba0017_submission_date,																																							
aba0017_t1_date AS settle_date																																							
FROM aba0017_final_daily_price																																							
)																																							
ON TO_CHAR(aba0017_submission_date,'yyyymmdd') = TO_CHAR(recv_date2,'yyyymmdd')																																							
) ON sec_code2                                 =sec_code																																							
AND TO_CHAR(recv_date,'yyyymmdd')                = TO_CHAR(recv_date2,'yyyymmdd')																																							
ORDER BY recv_date,																																							
recv_date2																																							
;																																							
--------------------------------------------------------																																							
--  DDL for View VWALLOTMENTRESULTS																																							
--------------------------------------------------------																																							
																																							
CREATE OR REPLACE FORCE EDITIONABLE VIEW "MS9ABA"."VWALLOTMENTRESULTS" ("ABA0101_SB_SECURITY_CODE", "ABA0101_SB_ISIN_CODE", "ABA0101_SB_ISSUE_DATE", "ABA0101_SB_MATURITY_DATE", "ABA0101_SB_TENOR", "ABA0101_SB_ISSUE_SIZE", "ABA0101_SB_QTY_APPLIED", "TOTAL_APPLIED_WITHIN_LIMITS", "ABA0101_SB_QTY_ALLOTTED", "ABA0101_SB_CUTOFF_AMT", "ABA0101_SB_RANDOM_ALLOT_RATE") AS																																							
SELECT																																							
ABA0101_SB_SECURITY_CODE,																																							
ABA0101_SB_ISIN_CODE,																																							
ABA0101_SB_ISSUE_DATE,																																							
ABA0101_SB_MATURITY_DATE,																																							
ABA0101_SB_TENOR,																																							
ABA0101_SB_ISSUE_SIZE,																																							
ABA0101_SB_QTY_APPLIED,																																							
(ABA0101_SB_QTY_APPLIED-ABA0101_SB_QTY_REJECTED) AS Total_Applied_Within_Limits,																																							
ABA0101_SB_QTY_ALLOTTED,																																							
ABA0101_SB_CUTOFF_AMT,																																							
ABA0101_SB_RANDOM_ALLOT_RATE																																							
FROM ABA0101_SB_SECURITY_MASTER																																							
;																																							
--------------------------------------------------------																																							
--  DDL for View VWAMOUNTOUTSTANDING																																							
--------------------------------------------------------																																							
																																							
CREATE OR REPLACE FORCE EDITIONABLE VIEW "MS9ABA"."VWAMOUNTOUTSTANDING" ("ABA0101_SB_SECURITY_CODE", "ABA0101_SB_ISIN_CODE", "ABA0101_SB_ISSUE_DATE", "ABA0101_SB_MATURITY_DATE", "ABA0101_SB_ISSUE_SIZE", "ABA0101_SB_QTY_ALLOTTED", "AMOUNT_OUTSTANDING", "AMTOUTSTANDING_PERCENTAGE", "AMOUNTREDEEMEDIN_YEAR1", "AMOUNTREDEEMEDIN_YEAR2", "AMOUNTREDEEMEDIN_YEAR3", "AMOUNTREDEEMEDIN_YEAR4", "AMOUNTREDEEMEDIN_YEAR5", "AMOUNTREDEEMEDIN_YEAR6", "AMOUNTREDEEMEDIN_YEAR7", "AMOUNTREDEEMEDIN_YEAR8", "AMOUNTREDEEMEDIN_YEAR9", "AMOUNTREDEEMEDIN_YEAR10") AS																																							
SELECT ABA0101_SB_SECURITY_CODE,																																							
ABA0101_SB_ISIN_CODE,																																							
ABA0101_SB_ISSUE_DATE,																																							
ABA0101_SB_MATURITY_DATE,																																							
ABA0101_SB_ISSUE_SIZE,																																							
ABA0101_SB_QTY_ALLOTTED,																																							
( ABA0101_SB_QTY_ALLOTTED       - ABA0101_SB_QTY_REDEEMED)                                                     AS Amount_Outstanding,																																							
ROUND((( ABA0101_SB_QTY_ALLOTTED- ABA0101_SB_QTY_REDEEMED)/ ABA0101_SB_QTY_ALLOTTED)*100,5)                    AS AMTOutstanding_percentage,																																							
ufnGetYearlyRedemptionResult(TRUNC(ABA0101_SB_ISSUE_DATE,'MM'),ABA0101_SB_SECURITY_CODE)                       AS AmountRedeemedin_Year1,																																							
ufnGetYearlyRedemptionResult(add_months((TRUNC(ABA0101_SB_ISSUE_DATE,'MM')), 12 ),ABA0101_SB_SECURITY_CODE) AS AmountRedeemedin_Year2,																																							
ufnGetYearlyRedemptionResult(add_months((TRUNC(ABA0101_SB_ISSUE_DATE,'MM')), 24 ),ABA0101_SB_SECURITY_CODE) AS AmountRedeemedin_Year3,																																							
ufnGetYearlyRedemptionResult(add_months((TRUNC(ABA0101_SB_ISSUE_DATE,'MM')), 36 ),ABA0101_SB_SECURITY_CODE) AS AmountRedeemedin_Year4,																																							
ufnGetYearlyRedemptionResult(add_months((TRUNC(ABA0101_SB_ISSUE_DATE,'MM')), 48 ) ,ABA0101_SB_SECURITY_CODE) AS AmountRedeemedin_Year5,																																							
ufnGetYearlyRedemptionResult(add_months((TRUNC(ABA0101_SB_ISSUE_DATE,'MM')), 60 ) ,ABA0101_SB_SECURITY_CODE) AS AmountRedeemedin_Year6,																																							
ufnGetYearlyRedemptionResult(add_months((TRUNC(ABA0101_SB_ISSUE_DATE,'MM')), 72 ) ,ABA0101_SB_SECURITY_CODE) AS AmountRedeemedin_Year7,																																							
ufnGetYearlyRedemptionResult(add_months((TRUNC(ABA0101_SB_ISSUE_DATE,'MM')), 84 ) ,ABA0101_SB_SECURITY_CODE) AS AmountRedeemedin_Year8,																																							
ufnGetYearlyRedemptionResult(add_months((TRUNC(ABA0101_SB_ISSUE_DATE,'MM')), 96 ) ,ABA0101_SB_SECURITY_CODE) AS AmountRedeemedin_Year9,																																							
ufnGetYearlyRedemptionResult(add_months((TRUNC(ABA0101_SB_ISSUE_DATE,'MM')), 108 ) ,ABA0101_SB_SECURITY_CODE) AS AmountRedeemedin_Year10																																							
FROM ABA0101_SB_SECURITY_MASTER																																							
WHERE ABA0101_SB_RESULT_LOAD_DATE IS NOT NULL																																							
;																																							
--------------------------------------------------------																																							
--  DDL for View VWSTEPUPINTEREST																																							
--------------------------------------------------------																																							
																																							
CREATE OR REPLACE FORCE EDITIONABLE VIEW "MS9ABA"."VWSTEPUPINTEREST" ("ABA0101_SB_SECURITY_CODE", "ABA0101_SB_ISIN_CODE", "ABA0101_SB_ISSUE_DATE", "ABA0101_SB_MATURITY_DATE", "ABA0101_SB_INT_DATE1", "ABA0101_SB_INT_DATE2", "COUPONPERCENTAGE_YEAR1", "COUPONPERCENTAGE_YEAR2", "COUPONPERCENTAGE_YEAR3", "COUPONPERCENTAGE_YEAR4", "COUPONPERCENTAGE_YEAR5", "COUPONPERCENTAGE_YEAR6", "COUPONPERCENTAGE_YEAR7", "COUPONPERCENTAGE_YEAR8", "COUPONPERCENTAGE_YEAR9", "COUPONPERCENTAGE_YEAR10", "RETURNRATEPERCENTAGE_YEAR1", "RETURNRATEPERCENTAGE_YEAR2", "RETURNRATEPERCENTAGE_YEAR3", "RETURNRATEPERCENTAGE_YEAR4", "RETURNRATEPERCENTAGE_YEAR5", "RETURNRATEPERCENTAGE_YEAR6", "RETURNRATEPERCENTAGE_YEAR7", "RETURNRATEPERCENTAGE_YEAR8", "RETURNRATEPERCENTAGE_YEAR9", "RETURNRATEPERCENTAGE_YEAR10") AS																																							
SELECT																																							
ABA0101_SB_SECURITY_CODE,																																							
ABA0101_SB_ISIN_CODE,																																							
ABA0101_SB_ISSUE_DATE,																																							
ABA0101_SB_MATURITY_DATE,																																							
ABA0101_SB_INT_DATE1,																																							
ABA0101_SB_INT_DATE2,																																							
ufnGetCouponPercentage (ABA0101_SB_SECURITY_CODE,1,2) as CouponPercentage_year1,																																							
ufnGetCouponPercentage (ABA0101_SB_SECURITY_CODE,2,2) as CouponPercentage_year2,																																							
ufnGetCouponPercentage (ABA0101_SB_SECURITY_CODE,3,2) as CouponPercentage_year3,																																							
ufnGetCouponPercentage (ABA0101_SB_SECURITY_CODE,4,2) as CouponPercentage_year4,																																							
ufnGetCouponPercentage (ABA0101_SB_SECURITY_CODE,5,2) as CouponPercentage_year5,																																							
ufnGetCouponPercentage (ABA0101_SB_SECURITY_CODE,6,2) as CouponPercentage_year6,																																							
ufnGetCouponPercentage (ABA0101_SB_SECURITY_CODE,7,2) as CouponPercentage_year7,																																							
ufnGetCouponPercentage (ABA0101_SB_SECURITY_CODE,8,2) as CouponPercentage_year8,																																							
ufnGetCouponPercentage (ABA0101_SB_SECURITY_CODE,9,2) as CouponPercentage_year9,																																							
ufnGetCouponPercentage (ABA0101_SB_SECURITY_CODE,10,2) as CouponPercentage_year10,																																							
ufnGetReturnRatePercentage (ABA0101_SB_SECURITY_CODE,1,2) as ReturnRatePercentage_year1,																																							
ufnGetReturnRatePercentage (ABA0101_SB_SECURITY_CODE,2,2) as ReturnRatePercentage_year2,																																							
ufnGetReturnRatePercentage (ABA0101_SB_SECURITY_CODE,3,2) as ReturnRatePercentage_year3,																																							
ufnGetReturnRatePercentage (ABA0101_SB_SECURITY_CODE,4,2) as ReturnRatePercentage_year4,																																							
ufnGetReturnRatePercentage (ABA0101_SB_SECURITY_CODE,5,2) as ReturnRatePercentage_year5,																																							
ufnGetReturnRatePercentage (ABA0101_SB_SECURITY_CODE,6,2) as ReturnRatePercentage_year6,																																							
ufnGetReturnRatePercentage (ABA0101_SB_SECURITY_CODE,7,2) as ReturnRatePercentage_year7,																																							
ufnGetReturnRatePercentage (ABA0101_SB_SECURITY_CODE,8,2) as ReturnRatePercentage_year8,																																							
ufnGetReturnRatePercentage (ABA0101_SB_SECURITY_CODE,9,2) as ReturnRatePercentage_year9,																																							
ufnGetReturnRatePercentage (ABA0101_SB_SECURITY_CODE,10,2) as ReturnRatePercentage_year10																																							
FROM ABA0101_SB_SECURITY_MASTER																																							
;																																							
--------------------------------------------------------																																							
--  DDL for Index PK_ABA0001_SECURITY_MASTER																																							
--------------------------------------------------------																																							
																																							
CREATE UNIQUE INDEX "MS9ABA"."PK_ABA0001_SECURITY_MASTER" ON "MS9ABA"."ABA0001_SECURITY_MASTER" ("ABA0001_SECURITY_CODE", "ABA0001_ISSUE_NO")																																							
PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Index PK_ABA0002_FRN_ISSUE																																							
--------------------------------------------------------																																							
																																							
CREATE UNIQUE INDEX "MS9ABA"."PK_ABA0002_FRN_ISSUE" ON "MS9ABA"."ABA0002_FRN_ISSUE" ("ABA0002_SECURITY_CODE", "ABA0002_ISSUE_NO")																																							
PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Index PK_ABA0004																																							
--------------------------------------------------------																																							
																																							
CREATE UNIQUE INDEX "MS9ABA"."PK_ABA0004" ON "MS9ABA"."ABA0004_RETAIL_BID_TRANS_BKP" ("ABA0004_SECURITY_CODE", "ABA0004_ISSUE_NO", "ABA0004_BANK_REF_NO")																																							
PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Index PK_ABA0004_RETAIL_BID_TRANS																																							
--------------------------------------------------------																																							
																																							
CREATE UNIQUE INDEX "MS9ABA"."PK_ABA0004_RETAIL_BID_TRANS" ON "MS9ABA"."ABA0004_RETAIL_BID_TRANS" ("ABA0004_SECURITY_CODE", "ABA0004_ISSUE_NO", "ABA0004_BANK_REF_NO")																																							
PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Index PK_ABA0005																																							
--------------------------------------------------------																																							
																																							
CREATE UNIQUE INDEX "MS9ABA"."PK_ABA0005" ON "MS9ABA"."ABA0005_RSA_TEXT_ENC_TRANS" ("ABA0005_SECURITY_CODE", "ABA0005_ISSUE_NO", "ABA0005_BANK_REF_NO")																																							
PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Index PK_ABA0006_AUCTION_RESULT																																							
--------------------------------------------------------																																							
																																							
CREATE UNIQUE INDEX "MS9ABA"."PK_ABA0006_AUCTION_RESULT" ON "MS9ABA"."ABA0006_AUCTION_RESULT" ("ABA0006_SECURITY_CODE", "ABA0006_ISSUE_NO", "ABA0006_BANK_ACC_CODE", "ABA0006_TENDER_DATE", "ABA0006_LINE_NO")																																							
PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 3145728 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Index PK_ABA0007_IND_AUCT_RESULT																																							
--------------------------------------------------------																																							
																																							
CREATE UNIQUE INDEX "MS9ABA"."PK_ABA0007_IND_AUCT_RESULT" ON "MS9ABA"."ABA0007_DETAIL_AUCTION_RESULT" ("ABA0007_SECURITY_CODE", "ABA0007_ISSUE_NO", "ABA0007_FORM_NO")																																							
PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Index PK_ABA0009_BANK_MASTER																																							
--------------------------------------------------------																																							
																																							
CREATE UNIQUE INDEX "MS9ABA"."PK_ABA0009_BANK_MASTER" ON "MS9ABA"."ABA0009_BANK_MASTER" ("ABA0009_BANK_CODE")																																							
PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Index PK_ABA0010_ANNOUNCE_TEXT																																							
--------------------------------------------------------																																							
																																							
CREATE UNIQUE INDEX "MS9ABA"."PK_ABA0010_ANNOUNCE_TEXT" ON "MS9ABA"."ABA0010_ANNOUNCE_TEXT" ("ABA0010_NAME", "ABA0010_USED_BEFORE")																																							
PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Index PK_ABA0011_DAILY_PRICE																																							
--------------------------------------------------------																																							
																																							
CREATE UNIQUE INDEX "MS9ABA"."PK_ABA0011_DAILY_PRICE" ON "MS9ABA"."ABA0011_DAILY_PRICE" ("ABA0011_SECURITY_CODE", "ABA0011_ISSUE_NO", "ABA0011_BANK_ACC_CODE", "ABA0011_SUBMISSION_DATE")																																							
PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 6291456 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Index PK_ABA0012_DP_STATUS																																							
--------------------------------------------------------																																							
																																							
CREATE UNIQUE INDEX "MS9ABA"."PK_ABA0012_DP_STATUS" ON "MS9ABA"."ABA0012_DP_STATUS" ("ABA0012_BANK_ACC_CODE", "ABA0012_SUBMISSION_DATE")																																							
PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Index PK_ABA0013_PRIMARY_DEALER																																							
--------------------------------------------------------																																							
																																							
CREATE UNIQUE INDEX "MS9ABA"."PK_ABA0013_PRIMARY_DEALER" ON "MS9ABA"."ABA0013_PRIMARY_DEALER" ("ABA0013_BANK_CODE")																																							
PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Index PK_ABA0015_PRICE_SPREAD																																							
--------------------------------------------------------																																							
																																							
CREATE UNIQUE INDEX "MS9ABA"."PK_ABA0015_PRICE_SPREAD" ON "MS9ABA"."ABA0015_PRICE_SPREAD" ("ABA0015_TYPE")																																							
PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Index PK_ABA0016_DAILY_EXTRA_DATA																																							
--------------------------------------------------------																																							
																																							
CREATE UNIQUE INDEX "MS9ABA"."PK_ABA0016_DAILY_EXTRA_DATA" ON "MS9ABA"."ABA0016_DAILY_EXTRA_DATA" ("ABA0016_BANK_ACC_CODE", "ABA0016_SUBMISSION_DATE")																																							
PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Index PK_ABA0017_FINAL_DAILY_PRICE																																							
--------------------------------------------------------																																							
																																							
CREATE UNIQUE INDEX "MS9ABA"."PK_ABA0017_FINAL_DAILY_PRICE" ON "MS9ABA"."ABA0017_FINAL_DAILY_PRICE" ("ABA0017_SECURITY_CODE", "ABA0017_ISSUE_NO", "ABA0017_SUBMISSION_DATE")																																							
PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 6291456 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Index PK_ABA0018_FINAL_EXTRA_PRICE																																							
--------------------------------------------------------																																							
																																							
CREATE UNIQUE INDEX "MS9ABA"."PK_ABA0018_FINAL_EXTRA_PRICE" ON "MS9ABA"."ABA0018_FINAL_EXTRA_PRICE" ("ABA0018_SECURITY_TYPE", "ABA0018_SUBMISSION_DATE")																																							
PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Index PK_ABA0019_PUBLIC_HOLIDAY																																							
--------------------------------------------------------																																							
																																							
CREATE UNIQUE INDEX "MS9ABA"."PK_ABA0019_PUBLIC_HOLIDAY" ON "MS9ABA"."ABA0019_PUBLIC_HOLIDAY" ("ABA0019_DATE", "ABA0019_COUNTRY")																																							
PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Index PK_ABA0020_BANK_MASTER																																							
--------------------------------------------------------																																							
																																							
CREATE UNIQUE INDEX "MS9ABA"."PK_ABA0020_BANK_MASTER" ON "MS9ABA"."ABA0020_STAGING_BANK_MASTER" ("ABA0020_BANK_CODE")																																							
PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Index PK_ABA0021_ISSUE_CALENDAR																																							
--------------------------------------------------------																																							
																																							
CREATE UNIQUE INDEX "MS9ABA"."PK_ABA0021_ISSUE_CALENDAR" ON "MS9ABA"."ABA0021_ISSUE_CALENDAR" ("ABA0021_SECURITY_CODE", "ABA0021_ISSUE_NO")																																							
PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Index PK_ABA0022_NON_BENCHMARK																																							
--------------------------------------------------------																																							
																																							
CREATE UNIQUE INDEX "MS9ABA"."PK_ABA0022_NON_BENCHMARK" ON "MS9ABA"."ABA0022_NON_BENCHMARK" ("ABA0022_SECURITY_CODE", "ABA0022_ISSUE_NO")																																							
PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Index PK_ABA0032_EAPPS_CONFIG																																							
--------------------------------------------------------																																							
																																							
CREATE UNIQUE INDEX "MS9ABA"."PK_ABA0032_EAPPS_CONFIG" ON "MS9ABA"."ABA0032_EAPPS_CONFIG" ("ABA0032_KEY")																																							
PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 65536 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Index PK_ABA0034_STG_SC_MASTER																																							
--------------------------------------------------------																																							
																																							
CREATE UNIQUE INDEX "MS9ABA"."PK_ABA0034_STG_SC_MASTER" ON "MS9ABA"."ABA0034_STG_SC_SECURITY_MASTER" ("ABA0034_SECURITY_CODE", "ABA0034_ISSUE_NO")																																							
PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Index PK_ABA0501_ENCRYPTED_REPO																																							
--------------------------------------------------------																																							
																																							
CREATE UNIQUE INDEX "MS9ABA"."PK_ABA0501_ENCRYPTED_REPO" ON "MS9ABA"."ABA0501_ENCRYPTED_REPO_TRANS" ("ABA0501_BANK_CODE", "ABA0501_TRANS_REF_NO", "ABA0501_RECEIVED_DT")																																							
PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Index PK_ABA0503_OPEN_ISSUES																																							
--------------------------------------------------------																																							
																																							
CREATE UNIQUE INDEX "MS9ABA"."PK_ABA0503_OPEN_ISSUES" ON "MS9ABA"."ABA0503_OPEN_ISSUES" ("ABA0503_SECURITY_CODE", "ABA0503_UPDATED_DT")																																							
PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Index PK_ABA0504_AUCTION_SUMMARY																																							
--------------------------------------------------------																																							
																																							
CREATE UNIQUE INDEX "MS9ABA"."PK_ABA0504_AUCTION_SUMMARY" ON "MS9ABA"."ABA0504_AUCTION_SUMMARY" ("ABA0504_SECURITY_CODE", "ABA0504_UPDATED_DT")																																							
PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Index PK_ABA0505_AUCTION_DETAILS																																							
--------------------------------------------------------																																							
																																							
CREATE UNIQUE INDEX "MS9ABA"."PK_ABA0505_AUCTION_DETAILS" ON "MS9ABA"."ABA0505_AUCTION_DETAILS" ("ABA0505_SECURITY_CODE", "ABA0505_BANK_CODE", "ABA0505_SEQ_NO", "ABA0505_TRANS_REF_NO")																																							
PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Index PK_ABA0507_SPLIT_BIDS																																							
--------------------------------------------------------																																							
																																							
CREATE UNIQUE INDEX "MS9ABA"."PK_ABA0507_SPLIT_BIDS" ON "MS9ABA"."ABA0507_SPLIT_BIDS" ("ABA0507_TRANS_REF_NO", "ABA0507_SEQ_NO")																																							
PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Index PK_ABA0601_ENCRYPTED_REPO																																							
--------------------------------------------------------																																							
																																							
CREATE UNIQUE INDEX "MS9ABA"."PK_ABA0601_ENCRYPTED_REPO" ON "MS9ABA"."ABA0601_ENCRYPTED_REPO_TRANS" ("ABA0601_BANK_CODE", "ABA0601_TRANS_REF_NO", "ABA0601_RECEIVED_DT")																																							
PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Index PK_ABA0603_OPEN_ISSUES																																							
--------------------------------------------------------																																							
																																							
CREATE UNIQUE INDEX "MS9ABA"."PK_ABA0603_OPEN_ISSUES" ON "MS9ABA"."ABA0603_OPEN_ISSUES" ("ABA0603_SECURITY_CODE", "ABA0603_UPDATED_DT")																																							
PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Index PK_ABA0605_TRADE_DETAILS																																							
--------------------------------------------------------																																							
																																							
CREATE UNIQUE INDEX "MS9ABA"."PK_ABA0605_TRADE_DETAILS" ON "MS9ABA"."ABA0605_TRADE_DETAILS" ("ABA0605_SECURITY_CODE", "ABA0605_BANK_CODE", "ABA0605_SEQ_NO", "ABA0605_TRANS_REF_NO")																																							
PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Index PK_ABA0607_SPLIT_BIDS																																							
--------------------------------------------------------																																							
																																							
CREATE UNIQUE INDEX "MS9ABA"."PK_ABA0607_SPLIT_BIDS" ON "MS9ABA"."ABA0607_SPLIT_BIDS" ("ABA0607_TRANS_REF_NO", "ABA0607_SEQ_NO")																																							
PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Index PK_ABA0610_REJECTED_ISSUES																																							
--------------------------------------------------------																																							
																																							
CREATE UNIQUE INDEX "MS9ABA"."PK_ABA0610_REJECTED_ISSUES" ON "MS9ABA"."ABA0610_REJECTED_ISSUES" ("ABA0610_SECURITY_CODE", "ABA0610_UPDATED_DT")																																							
PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Index PK_ABA2000_TASK																																							
--------------------------------------------------------																																							
																																							
CREATE UNIQUE INDEX "MS9ABA"."PK_ABA2000_TASK" ON "MS9ABA"."ABA2000_TASK_REGISTRY" ("ABA2000_TASK_ID")																																							
PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Index PK_AQA0002_TRANSACTION																																							
--------------------------------------------------------																																							
																																							
CREATE UNIQUE INDEX "MS9ABA"."PK_AQA0002_TRANSACTION" ON "MS9ABA"."AQA0002_TRANSACTION" ("AQA0002_SECURITY_CODE", "AQA0002_ISSUE_NO", "AQA0002_FORM_NO")																																							
PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Index PK_AQA0005_REPORT_COUNTER																																							
--------------------------------------------------------																																							
																																							
CREATE UNIQUE INDEX "MS9ABA"."PK_AQA0005_REPORT_COUNTER" ON "MS9ABA"."AQA0005_REPORT_COUNTER" ("AQA0005_DATE", "AQA0005_COUNT")																																							
PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Index PK_AQA0006_EAPPS_TRANSACTION																																							
--------------------------------------------------------																																							
																																							
CREATE UNIQUE INDEX "MS9ABA"."PK_AQA0006_EAPPS_TRANSACTION" ON "MS9ABA"."AQA0006_EAPPS_TRANSACTION" ("AQA0006_SECURITY_CODE", "AQA0006_ISSUE_NO", "AQA0006_REFERENCE_NO")																																							
PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Index PK_AQA0008_SEC_AUCTION_PARA																																							
--------------------------------------------------------																																							
																																							
CREATE UNIQUE INDEX "MS9ABA"."PK_AQA0008_SEC_AUCTION_PARA" ON "MS9ABA"."AQA0008_SEC_AUCTION_PARA" ("AQA0008_SECURITY_CODE", "AQA0008_ISSUE_NO")																																							
PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Index PK_AQA0020_AUCTION_RESULTS_REPORT																																							
--------------------------------------------------------																																							
																																							
CREATE UNIQUE INDEX "MS9ABA"."PK_AQA0020_AUCTION_RESULTS_REPORT" ON "MS9ABA"."AQA0020_AUCTION_RESULTS_REPORT" ("AQA0020_SECURITY_CODE", "AQA0020_ISSUE_NO", "AQA0020_FORM_NO")																																							
PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Index SK_ABA0005																																							
--------------------------------------------------------																																							
																																							
CREATE UNIQUE INDEX "MS9ABA"."SK_ABA0005" ON "MS9ABA"."ABA0005_RSA_TEXT_ENC_TRANS" ("ABA0005_SECURITY_CODE", "ABA0005_ISSUE_NO", "ABA0005_REF_NO")																																							
PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Index UK_ABA0034																																							
--------------------------------------------------------																																							
																																							
CREATE UNIQUE INDEX "MS9ABA"."UK_ABA0034" ON "MS9ABA"."ABA0034_EAPPS_SUBMISSION_CUTOFF_TIME" ("ABA0034_NAME")																																							
PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Index UK_ABA0035																																							
--------------------------------------------------------																																							
																																							
CREATE UNIQUE INDEX "MS9ABA"."UK_ABA0035" ON "MS9ABA"."ABA0035_RETAILBID_FILE" ("ABA0035_BANK_ACC_CODE", "ABA0035_PROCESSING_DATE", "ABA0035_FILE_NAME")																																							
PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Index UK_ABA0035_TMP																																							
--------------------------------------------------------																																							
																																							
CREATE UNIQUE INDEX "MS9ABA"."UK_ABA0035_TMP" ON "MS9ABA"."ABA0035_RETAILBID_FILE_TMP" ("ABA0035_BANK_ACC_CODE", "ABA0035_PROCESSING_DATE", "ABA0035_FILE_NAME")																																							
PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 65536 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Index ABA0027_PK_INDEX																																							
--------------------------------------------------------																																							
																																							
CREATE UNIQUE INDEX "MS9ABA"."ABA0027_PK_INDEX" ON "MS9ABA"."ABA0027_BATCH_JOB" ("ABA0027_JOB_ID")																																							
PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Index ABA0028_PK_INDEX																																							
--------------------------------------------------------																																							
																																							
CREATE UNIQUE INDEX "MS9ABA"."ABA0028_PK_INDEX" ON "MS9ABA"."ABA0028_BATCH_JOB_EXECUTION" ("ABA0028_JOB_EXECUTION_ID")																																							
PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Index ABA0030_CORP_PASS_MAPPING_PK																																							
--------------------------------------------------------																																							
																																							
CREATE UNIQUE INDEX "MS9ABA"."ABA0030_CORP_PASS_MAPPING_PK" ON "MS9ABA"."ABA0030_CORP_PASS_MAPPING" ("ABA0030_BANK_CODE", "ABA0030_CP_ENTITY_ID", "ABA0030_CP_UID")																																							
PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 65536 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Index ABA0030_CORP_PASS_MAPPING_UK																																							
--------------------------------------------------------																																							
																																							
CREATE UNIQUE INDEX "MS9ABA"."ABA0030_CORP_PASS_MAPPING_UK" ON "MS9ABA"."ABA0030_CORP_PASS_MAPPING" ("ABA0030_TOKEN_USER_ID")																																							
PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Index ABA0031_OUTSTANDING_FRN_PK																																							
--------------------------------------------------------																																							
																																							
CREATE UNIQUE INDEX "MS9ABA"."ABA0031_OUTSTANDING_FRN_PK" ON "MS9ABA"."ABA0031_OUTSTANDING_FRN" ("ABA0031_YEAR", "ABA0031_MONTH")																																							
PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 65536 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Index ABA0214_PK_INDEX																																							
--------------------------------------------------------																																							
																																							
CREATE UNIQUE INDEX "MS9ABA"."ABA0214_PK_INDEX" ON "MS9ABA"."ABA0214_SB_CD_FILE_TYPE" ("ABA0214_SB_CD_FILE_TYPE")																																							
PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP" ;																																							
--------------------------------------------------------																																							
--  DDL for Index ABA0222_PK_INDEX																																							
--------------------------------------------------------																																							
																																							
CREATE UNIQUE INDEX "MS9ABA"."ABA0222_PK_INDEX" ON "MS9ABA"."ABA0222_SB_ORG" ("ABA0222_SB_ORG_ID")																																							
PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP" ;																																							
CREATE MATERIALIZED VIEW LOG ON "MS9ABA"."ABA0001_SECURITY_MASTER"																																							
PCTFREE 60 PCTUSED 30 INITRANS 1 MAXTRANS 255 LOGGING																																							
STORAGE(INITIAL 11534336 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP"																																							
WITH ROWID INCLUDING NEW VALUES EXCLUDING NEW VALUES;																																							
CREATE MATERIALIZED VIEW LOG ON "MS9ABA"."ABA0017_FINAL_DAILY_PRICE"																																							
PCTFREE 60 PCTUSED 30 INITRANS 1 MAXTRANS 255 LOGGING																																							
STORAGE(INITIAL 133169152 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP"																																							
WITH ROWID INCLUDING NEW VALUES EXCLUDING NEW VALUES;																																							
CREATE MATERIALIZED VIEW LOG ON "MS9ABA"."ABA0018_FINAL_EXTRA_PRICE"																																							
PCTFREE 60 PCTUSED 30 INITRANS 1 MAXTRANS 255 LOGGING																																							
STORAGE(INITIAL 2097152 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP"																																							
WITH ROWID INCLUDING NEW VALUES EXCLUDING NEW VALUES;																																							
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
--  DDL for Procedure ABA0505_GET_SPLIT_BIDS																																							
--------------------------------------------------------																																							
set define off;																																							
																																							
CREATE OR REPLACE EDITIONABLE PROCEDURE "MS9ABA"."ABA0505_GET_SPLIT_BIDS" (																																							
AUCTION_DT IN VARCHAR2)																																							
AS																																							
CURSOR CUR_AUCTION_DET IS																																							
SELECT ABA0505_TRANS_REF_NO, ABA0505_SEQ_NO, ABA0505_AMT_APPLIED, ABA0505_AMT_ALLOTED, aba0001_maturity_date, ABA0505_AUCTION_DT FROM MS9ABA.ABA0505_AUCTION_DETAILS INNER JOIN																																							
MS9ABA.ABA0001_SECURITY_MASTER ON ABA0505_SECURITY_CODE = ABA0001_SECURITY_CODE																																							
WHERE ABA0505_AMT_ALLOTED>0 AND TO_CHAR(ABA0505_AUCTION_DT,'yyyymmdd')=AUCTION_DT																																							
AND aba0001_issue_no in (select max(aba0001_issue_no) from ms9aba.aba0001_security_master																																							
where aba0001_security_code = ABA0505_SECURITY_CODE)																																							
order by to_char(aba0001_maturity_date,'yyyymmdd'), to_char(aba0505_updated_dt, 'yyyymmdd hh24:mi:ss.ff3');																																							
REC_AUCTION_DET CUR_AUCTION_DET%ROWTYPE;																																							
count1 number(2);																																							
ALLOT_AMT NUMBER(13);																																							
UNALLOT_AMT NUMBER(13);																																							
TRANS_REF_NO CHAR(16);																																							
SEQ_NO1 CHAR(5);																																							
AUCTION_DATE DATE;																																							
BEGIN																																							
DELETE FROM MS9ABA.ABA0507_SPLIT_BIDS;																																							
OPEN CUR_AUCTION_DET;																																							
count1:=0;																																							
LOOP																																							
FETCH CUR_AUCTION_DET INTO REC_AUCTION_DET;																																							
EXIT WHEN CUR_AUCTION_DET%NOTFOUND; -- place immediately after FETCH																																							
IF (count1=1) THEN																																							
count1:=0;																																							
SEQ_NO1 := REC_AUCTION_DET.ABA0505_SEQ_NO;																																							
ALLOT_AMT := ALLOT_AMT + REC_AUCTION_DET.ABA0505_AMT_ALLOTED;																																							
UNALLOT_AMT:=REC_AUCTION_DET.ABA0505_AMT_APPLIED - ALLOT_AMT;																																							
INSERT INTO MS9ABA.ABA0507_SPLIT_BIDS VALUES (TRANS_REF_NO,SEQ_NO1,UNALLOT_AMT,AUCTION_DATE);																																							
END IF;																																							
if (REC_AUCTION_DET.ABA0505_AMT_APPLIED = 0) then																																							
count1:=count1 + 1;																																							
TRANS_REF_NO:=REC_AUCTION_DET.ABA0505_TRANS_REF_NO;																																							
AUCTION_DATE:=REC_AUCTION_DET.ABA0505_AUCTION_DT;																																							
ALLOT_AMT:=REC_AUCTION_DET.ABA0505_AMT_ALLOTED;																																							
END IF;																																							
END LOOP;																																							
DBMS_OUTPUT.PUT_LINE(TRANS_REF_NO || SEQ_NO1 || UNALLOT_AMT);																																							
COMMIT;																																							
CLOSE CUR_AUCTION_DET;																																							
END ABA0505_GET_SPLIT_BIDS;																																							
																																							
																																							
/																																							
--------------------------------------------------------																																							
--  DDL for Procedure ABA0609_RETRIGGER_APP_PROC																																							
--------------------------------------------------------																																							
set define off;																																							
																																							
CREATE OR REPLACE EDITIONABLE PROCEDURE "MS9ABA"."ABA0609_RETRIGGER_APP_PROC"																																							
(AUCTION_DT IN VARCHAR2)																																							
IS																																							
v_cnt NUMBER;																																							
BEGIN																																							
	select count(*) into v_cnt from ms9aba.aba0605_trade_details where to_char(ABA0605_RECEIVED_DT,'ddmmyyyy') = auction_dt AND ABA0605_STATUS_FLAG<>'C' AND ABA0605_STATUS_FLAG<>'V';																																						
	UPDATE MS9ABA.ABA0605_TRADE_DETAILS SET ABA0605_HAIRCUT_CLEAN_PRICE=0, ABA0605_HAIRCUT_DIRTY_PRICE=0,																																						
	ABA0605_EXG_HC_CLEAN_PRICE=0, ABA0605_EXG_HC_DIRTY_PRICE=0, ABA0605_EXG_NOMINAL_AMT=0, ABA0605_AMT_ALLOTTED=0,																																						
	ABA0605_LIMIT_IND='', ABA0605_REPO_FEE=0, ABA0605_NET_CASH=0, ABA0605_STATUS_FLAG='N' WHERE																																						
	to_char(ABA0605_RECEIVED_DT,'ddmmyyyy') = auction_dt AND ABA0605_STATUS_FLAG<>'C' AND ABA0605_STATUS_FLAG<>'V';																																						
	DBMS_OUTPUT.PUT_LINE(v_cnt);																																						
	COMMIT;																																						
END ABA0609_RETRIGGER_APP_PROC;																																							
																																							
																																							
/																																							
--------------------------------------------------------																																							
--  DDL for Procedure DELETE_ALL_BIDS																																							
--------------------------------------------------------																																							
set define off;																																							
																																							
CREATE OR REPLACE EDITIONABLE PROCEDURE "MS9ABA"."DELETE_ALL_BIDS" (AUCTION_DT IN VARCHAR2)																																							
AS																																							
BEGIN																																							
DELETE FROM MS9ABA.ABA0504_AUCTION_SUMMARY WHERE TO_CHAR(ABA0504_UPDATED_DT,																																							
yyyymmdd') = AUCTION_DT;																																							
DELETE FROM MS9ABA.ABA0505_AUCTION_DETAILS WHERE TO_CHAR(ABA0505_UPDATED_DT,																																							
yyyymmdd') = AUCTION_DT;																																							
DELETE FROM MS9ABA.ABA0501_ENCRYPTED_REPO_TRANS WHERE TO_CHAR(ABA0501_RECEIVED_DT,																																							
yyyymmdd') = AUCTION_DT;																																							
DELETE FROM MS9ABA.ABA0503_OPEN_ISSUES WHERE TO_CHAR(ABA0503_UPDATED_DT,																																							
yyyymmdd')=AUCTION_DT;																																							
COMMIT;																																							
END DELETE_ALL_BIDS;																																							
																																							
																																							
																																							
/																																							
--------------------------------------------------------																																							
--  DDL for Procedure SELENIUM_CHECK_SECURITY_EXISTS																																							
--------------------------------------------------------																																							
set define off;																																							
																																							
CREATE OR REPLACE EDITIONABLE PROCEDURE "MS9ABA"."SELENIUM_CHECK_SECURITY_EXISTS"																																							
(SECURITY_CODE IN VARCHAR2)																																							
AS																																							
																																							
security_count INTEGER;																																							
tender_date DATE;																																							
--SECURITY_CODE VARCHAR2(10) := 'NZ18AUTO';																																							
TENOR VARCHAR2(10);																																							
MATURITY_DATE DATE;																																							
NEXT_INT_DATE DATE;																																							
																																							
BEGIN																																							
--Written by Binita for Selenium Automation of EApps																																							
																																							
if(SECURITY_CODE LIKE 'B%') THEN																																							
TENOR := 183;																																							
MATURITY_DATE := to_date(SYSDATE+183,'DD/MM/RR');																																							
NEXT_INT_DATE := to_date(SYSDATE+183,'DD/MM/RR');																																							
elsif(SECURITY_CODE LIKE 'M%') THEN																																							
TENOR := 14;																																							
MATURITY_DATE := to_date(SYSDATE+14,'DD/MM/RR');																																							
NEXT_INT_DATE := null;																																							
else																																							
TENOR := 20;																																							
MATURITY_DATE := Add_months(SYSDATE,240);																																							
NEXT_INT_DATE := Add_months(SYSDATE,6);																																							
END IF;																																							
																																							
-- checking whether Security is present in security master table																																							
select count(*) INTO security_count from ABA0001_SECURITY_MASTER where ABA0001_SECURITY_CODE=SECURITY_CODE;																																							
if ((security_count) > 0) THEN																																							
select ABA0001_TENDER_DATE into tender_date from ABA0001_SECURITY_MASTER where ABA0001_SECURITY_CODE=SECURITY_CODE;																																							
END If;																																							
																																							
--add new security if not present																																							
if (security_count = 0) THEN																																							
Insert into ABA0001_SECURITY_MASTER																																							
(ABA0001_SECURITY_CODE,ABA0001_ISSUE_NO,ABA0001_ISSUE_TYPE,ABA0001_CURR,ABA0001_SECURITY_NAME,																																							
ABA0001_ISSUE_DATE,ABA0001_TENDER_DATE,ABA0001_ISSUE_SIZE,ABA0001_QTY_APPLIED,ABA0001_AVE_YIELD,																																							
ABA0001_CUTOFF_YIELD,ABA0001_MATURITY_DATE,ABA0001_PERCENT_COY,ABA0001_PERCENT_SUB,ABA0001_INTEREST_RATE,																																							
ABA0001_TAX_STATUS,ABA0001_AVE_PRICE,ABA0001_COY_PRICE,ABA0001_CLOSING_PRICE,ABA0001_REFERENCE_NO,ABA0001_ISIN_CODE,																																							
ABA0001_ANNOUNCE_DATE,ABA0001_RESULT_LOAD_DATE,ABA0001_LAST_INT_DATE,ABA0001_NEXT_INT_DATE,ABA0001_ACCRUED_INT_DAYS,																																							
ABA0001_INT_DATE1,ABA0001_INT_DATE2,ABA0001_INT_PAID_IND,ABA0001_TENOR,ABA0001_ETENDER_IND,ABA0001_MAS_APPLIED,																																							
ABA0001_MAS_ALLOTTED,ABA0001_NC_PERCENT,ABA0001_NC_QTY_ALLOT,ABA0001_EX_INT_DATE,ABA0001_QTY_APP_COMP,ABA0001_QTY_APP_NONCOMP,																																							
ABA0001_ACCRUED_INT,ABA0001_ANNOUNCE_INDICATOR,ABA0001_MEDIAN_YIELD,ABA0001_MEDIAN_PRICE)																																							
values																																							
(SECURITY_CODE, --ABA0001_SECURITY_CODE																																							
1',       --ABA0001_ISSUE_NO																																							
null,     --ABA0001_ISSUE_TYPE																																							
SGD',    --ABA0001_CURRE																																							
20YR BOND 2017 DUE 210837 NZ10', --ABA0001_SECURITY_NAME																																							
to_date(sysdate+1,'DD/MM/RR'),--ABA0001_ISSUE_DATE																																							
to_date(sysdate,'DD/MM/RR'),--ABA0001_TENDER_DATE																																							
1400000000,--ABA0001_ISSUE_SIZE																																							
0,--ABA0001_QTY_APPLIED																																							
0,--ABA0001_AVE_YIELD																																							
0,--ABA0001_CUTOFF_YIELD																																							
MATURITY_DATE,--ABA0001_MATURITY_DATE																																							
0,--ABA0001_PERCENT_COY																																							
0,--ABA0001_PERCENT_SUB																																							
0,--ABA0001_INTEREST_RATE																																							
Y',--ABA0001_TAX_STATUS																																							
0,--ABA0001_AVE_PRICE																																							
0,--ABA0001_COY_PRICE																																							
0,--ABA0001_CLOSING_PRICE																																							
null,--ABA0001_REFERENCE_NO																																							
SELENAUTO762',--ABA0001_ISIN_CODE																																							
to_date(sysdate-1,'DD/MM/RR'),--ABA0001_ANNOUNCE_DATE																																							
null,--ABA0001_RESULT_LOAD_DATE																																							
to_date(sysdate+1,'DD/MM/RR'),--ABA0001_LAST_INT_DATE																																							
NEXT_INT_DATE,--ABA0001_NEXT_INT_DATE																																							
0,--ABA0001_ACCRUED_INT_DAYS																																							
to_date('15/06/17','DD/MM/RR'),--ABA0001_INT_DATE1																																							
to_date('15/12/17','DD/MM/RR'),--ABA0001_INT_DATE2																																							
N',--ABA0001_INT_PAID_IND																																							
TENOR,--ABA0001_TENOR																																							
Y',--ABA0001_ETENDER_IND																																							
100000000,--ABA0001_MAS_APPLIED																																							
0,--ABA0001_MAS_ALLOTTED																																							
0,--ABA0001_NC_PERCENT																																							
0,--ABA0001_NC_QTY_ALLOT																																							
to_date('12/12/17','DD/MM/RR'),--ABA0001_EX_INT_DATE																																							
null,--ABA0001_QTY_APP_COMP																																							
null,--ABA0001_QTY_APP_NONCOMP																																							
0,--ABA0001_ACCRUED_INT																																							
N',--ABA0001_ANNOUNCE_INDICATOR																																							
null,--ABA0001_MEDIAN_YIELD																																							
null--ABA0001_MEDIAN_PRICE																																							
);																																							
elsif (tender_date <> SYSDATE)																																							
THEN																																							
update ABA0001_SECURITY_MASTER set ABA0001_TENDER_DATE=to_date(sysdate,'DD/MM/RR') where ABA0001_SECURITY_CODE=SECURITY_CODE;																																							
update ABA0001_SECURITY_MASTER set ABA0001_ISSUE_DATE=to_date(sysdate+1,'DD/MM/RR') where ABA0001_SECURITY_CODE=SECURITY_CODE;																																							
update ABA0001_SECURITY_MASTER set ABA0001_ANNOUNCE_DATE=to_date(sysdate-1,'DD/MM/RR') where ABA0001_SECURITY_CODE=SECURITY_CODE;																																							
END IF;																																							
																																							
END;																																							
																																							
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
--  DDL for Procedure USPCURSORALLOTMENTRESULTS																																							
--------------------------------------------------------																																							
set define off;																																							
																																							
CREATE OR REPLACE EDITIONABLE PROCEDURE "MS9ABA"."USPCURSORALLOTMENTRESULTS"																																							
IS																																							
Begin																																							
																																							
SAVEPOINT start_tran;																																							
																																							
Delete from ms9gsw.TBLALLOTMENTRESULTS@TCMA;																																							
Delete from ms9gsw.TBLALLOTMENTRESULTS@TCMB;																																							
																																							
DECLARE																																							
																																							
C_ABA0101_SB_SECURITY_CODE   ms9aba.vwAllotmentResults.ABA0101_SB_SECURITY_CODE%Type;																																							
C_ABA0101_SB_ISIN_CODE  ms9aba.vwAllotmentResults.ABA0101_SB_ISIN_CODE%Type;																																							
C_ABA0101_SB_ISSUE_DATE  ms9aba.vwAllotmentResults.ABA0101_SB_ISSUE_DATE%Type;																																							
C_ABA0101_SB_MATURITY_DATE ms9aba.vwAllotmentResults.ABA0101_SB_MATURITY_DATE%Type;																																							
C_ABA0101_SB_TENOR ms9aba.vwAllotmentResults.ABA0101_SB_TENOR%Type;																																							
C_ABA0101_SB_ISSUE_SIZE  ms9aba.vwAllotmentResults.ABA0101_SB_ISSUE_SIZE%Type;																																							
C_ABA0101_SB_QTY_APPLIED  ms9aba.vwAllotmentResults.ABA0101_SB_QTY_APPLIED%Type;																																							
C_Total_Applied_Within_Limits  ms9aba.vwAllotmentResults.Total_Applied_Within_Limits%Type;																																							
C_ABA0101_SB_QTY_ALLOTTED  ms9aba.vwAllotmentResults.ABA0101_SB_QTY_ALLOTTED%Type;																																							
C_ABA0101_SB_CUTOFF_AMT  ms9aba.vwAllotmentResults.ABA0101_SB_CUTOFF_AMT%Type;																																							
C_ABA0101_SB_RANDOM_ALLOT_RATE ms9aba.vwAllotmentResults.ABA0101_SB_RANDOM_ALLOT_RATE%Type;																																							
																																							
																																							
CURSOR c_CursorAllotmentResults is																																							
																																							
select																																							
																																							
ABA0101_SB_SECURITY_CODE,  ABA0101_SB_ISIN_CODE,																																							
ABA0101_SB_ISSUE_DATE, ABA0101_SB_MATURITY_DATE,																																							
ABA0101_SB_TENOR, ABA0101_SB_ISSUE_SIZE,																																							
ABA0101_SB_QTY_APPLIED,Total_Applied_Within_Limits,																																							
ABA0101_SB_QTY_ALLOTTED,ABA0101_SB_CUTOFF_AMT,																																							
ABA0101_SB_RANDOM_ALLOT_RATE																																							
																																							
from ms9aba.vwAllotmentResults;																																							
																																							
																																							
																																							
BEGIN																																							
OPEN c_CursorAllotmentResults;																																							
LOOP																																							
																																							
FETCH c_CursorAllotmentResults INTO																																							
																																							
C_ABA0101_SB_SECURITY_CODE,  C_ABA0101_SB_ISIN_CODE,																																							
C_ABA0101_SB_ISSUE_DATE, C_ABA0101_SB_MATURITY_DATE,																																							
C_ABA0101_SB_TENOR, C_ABA0101_SB_ISSUE_SIZE,																																							
C_ABA0101_SB_QTY_APPLIED,C_Total_Applied_Within_Limits,																																							
C_ABA0101_SB_QTY_ALLOTTED,C_ABA0101_SB_CUTOFF_AMT,																																							
C_ABA0101_SB_RANDOM_ALLOT_RATE ;																																							
																																							
																																							
EXIT WHEN c_CursorAllotmentResults%notfound;																																							
																																							
Insert into  ms9gsw.TBLALLOTMENTRESULTS@TCMA																																							
(																																							
ABA0101_SB_SECURITY_CODE,  ABA0101_SB_ISIN_CODE,																																							
ABA0101_SB_ISSUE_DATE, ABA0101_SB_MATURITY_DATE,																																							
ABA0101_SB_TENOR, ABA0101_SB_ISSUE_SIZE,																																							
ABA0101_SB_QTY_APPLIED,Total_Applied_Within_Limits,																																							
ABA0101_SB_QTY_ALLOTTED,ABA0101_SB_CUTOFF_AMT,																																							
ABA0101_SB_RANDOM_ALLOT_RATE																																							
) values																																							
(																																							
C_ABA0101_SB_SECURITY_CODE,  C_ABA0101_SB_ISIN_CODE,																																							
C_ABA0101_SB_ISSUE_DATE, C_ABA0101_SB_MATURITY_DATE,																																							
C_ABA0101_SB_TENOR, C_ABA0101_SB_ISSUE_SIZE,																																							
C_ABA0101_SB_QTY_APPLIED,C_Total_Applied_Within_Limits,																																							
C_ABA0101_SB_QTY_ALLOTTED,C_ABA0101_SB_CUTOFF_AMT,																																							
C_ABA0101_SB_RANDOM_ALLOT_RATE																																							
);																																							
																																							
																																							
Insert into  ms9gsw.TBLALLOTMENTRESULTS@TCMB																																							
(																																							
ABA0101_SB_SECURITY_CODE,  ABA0101_SB_ISIN_CODE,																																							
ABA0101_SB_ISSUE_DATE, ABA0101_SB_MATURITY_DATE,																																							
ABA0101_SB_TENOR, ABA0101_SB_ISSUE_SIZE,																																							
ABA0101_SB_QTY_APPLIED,Total_Applied_Within_Limits,																																							
ABA0101_SB_QTY_ALLOTTED,ABA0101_SB_CUTOFF_AMT,																																							
ABA0101_SB_RANDOM_ALLOT_RATE																																							
) values																																							
(																																							
C_ABA0101_SB_SECURITY_CODE,  C_ABA0101_SB_ISIN_CODE,																																							
C_ABA0101_SB_ISSUE_DATE, C_ABA0101_SB_MATURITY_DATE,																																							
C_ABA0101_SB_TENOR, C_ABA0101_SB_ISSUE_SIZE,																																							
C_ABA0101_SB_QTY_APPLIED,C_Total_Applied_Within_Limits,																																							
C_ABA0101_SB_QTY_ALLOTTED,C_ABA0101_SB_CUTOFF_AMT,																																							
C_ABA0101_SB_RANDOM_ALLOT_RATE																																							
);																																							
																																							
END LOOP;																																							
																																							
EXCEPTION																																							
WHEN OTHERS THEN																																							
ROLLBACK TO start_tran;																																							
RAISE;																																							
																																							
CLOSE c_CursorAllotmentResults;																																							
																																							
END; -- End Of cursor																																							
																																							
																																							
COMMIT;																																							
																																							
																																							
END;																																							
																																							
/																																							
--------------------------------------------------------																																							
--  DDL for Procedure USPCURSORAMOUNTOUTSTANDING																																							
--------------------------------------------------------																																							
set define off;																																							
																																							
CREATE OR REPLACE EDITIONABLE PROCEDURE "MS9ABA"."USPCURSORAMOUNTOUTSTANDING"																																							
IS																																							
Begin																																							
																																							
SAVEPOINT start_tran;																																							
																																							
Delete from ms9gsw.TBLAMOUNTOUTSTANDING@TCMA;																																							
Delete from ms9gsw.TBLAMOUNTOUTSTANDING@TCMB;																																							
																																							
DECLARE																																							
																																							
C_ABA0101_SB_SECURITY_CODE   ms9aba.vwAmountOutStanding.ABA0101_SB_SECURITY_CODE%Type;																																							
C_ABA0101_SB_ISIN_CODE  ms9aba.vwAmountOutStanding.ABA0101_SB_ISIN_CODE%Type;																																							
C_ABA0101_SB_ISSUE_DATE  ms9aba.vwAmountOutStanding.ABA0101_SB_ISSUE_DATE%Type;																																							
C_ABA0101_SB_MATURITY_DATE ms9aba.vwAmountOutStanding.ABA0101_SB_MATURITY_DATE%Type;																																							
C_ABA0101_SB_ISSUE_SIZE  ms9aba.vwAmountOutStanding.ABA0101_SB_ISSUE_SIZE%Type;																																							
																																							
C_ABA0101_SB_QTY_ALLOTTED  ms9aba.vwAmountOutStanding.ABA0101_SB_QTY_ALLOTTED%Type;																																							
																																							
C_Amount_Outstanding  ms9aba.vwAmountOutStanding.Amount_Outstanding%Type;																																							
C_AMTOutstanding_percentage  ms9aba.vwAmountOutStanding.AMTOutstanding_percentage%Type;																																							
C_AmountRedeemedin_Year1  ms9aba.vwAmountOutStanding.AmountRedeemedin_Year1%Type;																																							
C_AmountRedeemedin_Year2  ms9aba.vwAmountOutStanding.AmountRedeemedin_Year2%Type;																																							
C_AmountRedeemedin_Year3  ms9aba.vwAmountOutStanding.AmountRedeemedin_Year3%Type;																																							
C_AmountRedeemedin_Year4  ms9aba.vwAmountOutStanding.AmountRedeemedin_Year4%Type;																																							
C_AmountRedeemedin_Year5  ms9aba.vwAmountOutStanding.AmountRedeemedin_Year5%Type;																																							
C_AmountRedeemedin_Year6  ms9aba.vwAmountOutStanding.AmountRedeemedin_Year6%Type;																																							
C_AmountRedeemedin_Year7  ms9aba.vwAmountOutStanding.AmountRedeemedin_Year7%Type;																																							
C_AmountRedeemedin_Year8  ms9aba.vwAmountOutStanding.AmountRedeemedin_Year8%Type;																																							
C_AmountRedeemedin_Year9  ms9aba.vwAmountOutStanding.AmountRedeemedin_Year9%Type;																																							
C_AmountRedeemedin_Year10  ms9aba.vwAmountOutStanding.AmountRedeemedin_Year10%Type;																																							
																																							
																																							
CURSOR c_CursorAmountOutstanding is																																							
																																							
select																																							
ABA0101_SB_SECURITY_CODE,ABA0101_SB_ISIN_CODE,																																							
ABA0101_SB_ISSUE_DATE,ABA0101_SB_MATURITY_DATE,																																							
ABA0101_SB_ISSUE_SIZE,ABA0101_SB_QTY_ALLOTTED, Amount_Outstanding,																																							
AMTOutstanding_percentage,AmountRedeemedin_Year1,																																							
AmountRedeemedin_Year2,AmountRedeemedin_Year3,																																							
AmountRedeemedin_Year4,AmountRedeemedin_Year5,																																							
AmountRedeemedin_Year6,AmountRedeemedin_Year7,																																							
AmountRedeemedin_Year8,AmountRedeemedin_Year9,																																							
AmountRedeemedin_Year10																																							
from ms9aba.vwAmountOutStanding;																																							
																																							
																																							
																																							
BEGIN																																							
OPEN c_CursorAmountOutstanding;																																							
LOOP																																							
																																							
FETCH c_CursorAmountOutstanding INTO																																							
C_ABA0101_SB_SECURITY_CODE,C_ABA0101_SB_ISIN_CODE,																																							
C_ABA0101_SB_ISSUE_DATE,C_ABA0101_SB_MATURITY_DATE,																																							
C_ABA0101_SB_ISSUE_SIZE, C_ABA0101_SB_QTY_ALLOTTED,C_Amount_Outstanding,																																							
C_AMTOutstanding_percentage,C_AmountRedeemedin_Year1,																																							
C_AmountRedeemedin_Year2,C_AmountRedeemedin_Year3,																																							
C_AmountRedeemedin_Year4,C_AmountRedeemedin_Year5,																																							
C_AmountRedeemedin_Year6,C_AmountRedeemedin_Year7,																																							
C_AmountRedeemedin_Year8,C_AmountRedeemedin_Year9,																																							
C_AmountRedeemedin_Year10 ;																																							
																																							
																																							
EXIT WHEN c_CursorAmountOutstanding%notfound;																																							
																																							
Insert into  ms9gsw.TBLAMOUNTOUTSTANDING@TCMA																																							
(																																							
ABA0101_SB_SECURITY_CODE,ABA0101_SB_ISIN_CODE,																																							
ABA0101_SB_ISSUE_DATE,ABA0101_SB_MATURITY_DATE,																																							
ABA0101_SB_ISSUE_SIZE, ABA0101_SB_QTY_ALLOTTED,Amount_Outstanding,																																							
AMTOutstanding_percentage,AmountRedeemedin_Year1,																																							
AmountRedeemedin_Year2,AmountRedeemedin_Year3,																																							
AmountRedeemedin_Year4,AmountRedeemedin_Year5,																																							
AmountRedeemedin_Year6,AmountRedeemedin_Year7,																																							
AmountRedeemedin_Year8,AmountRedeemedin_Year9,																																							
AmountRedeemedin_Year10																																							
) values																																							
(																																							
C_ABA0101_SB_SECURITY_CODE,C_ABA0101_SB_ISIN_CODE,																																							
C_ABA0101_SB_ISSUE_DATE,C_ABA0101_SB_MATURITY_DATE,																																							
C_ABA0101_SB_ISSUE_SIZE,C_ABA0101_SB_QTY_ALLOTTED, C_Amount_Outstanding,																																							
C_AMTOutstanding_percentage,C_AmountRedeemedin_Year1,																																							
C_AmountRedeemedin_Year2,C_AmountRedeemedin_Year3,																																							
C_AmountRedeemedin_Year4,C_AmountRedeemedin_Year5,																																							
C_AmountRedeemedin_Year6,C_AmountRedeemedin_Year7,																																							
C_AmountRedeemedin_Year8,C_AmountRedeemedin_Year9,																																							
C_AmountRedeemedin_Year10																																							
);																																							
																																							
																																							
Insert into  ms9gsw.TBLAMOUNTOUTSTANDING@TCMB																																							
(																																							
ABA0101_SB_SECURITY_CODE,ABA0101_SB_ISIN_CODE,																																							
ABA0101_SB_ISSUE_DATE,ABA0101_SB_MATURITY_DATE,																																							
ABA0101_SB_ISSUE_SIZE,ABA0101_SB_QTY_ALLOTTED, Amount_Outstanding,																																							
AMTOutstanding_percentage,AmountRedeemedin_Year1,																																							
AmountRedeemedin_Year2,AmountRedeemedin_Year3,																																							
AmountRedeemedin_Year4,AmountRedeemedin_Year5,																																							
AmountRedeemedin_Year6,AmountRedeemedin_Year7,																																							
AmountRedeemedin_Year8,AmountRedeemedin_Year9,																																							
AmountRedeemedin_Year10																																							
) values																																							
(																																							
C_ABA0101_SB_SECURITY_CODE,C_ABA0101_SB_ISIN_CODE,																																							
C_ABA0101_SB_ISSUE_DATE,C_ABA0101_SB_MATURITY_DATE,																																							
C_ABA0101_SB_ISSUE_SIZE,C_ABA0101_SB_QTY_ALLOTTED, C_Amount_Outstanding,																																							
C_AMTOutstanding_percentage,C_AmountRedeemedin_Year1,																																							
C_AmountRedeemedin_Year2,C_AmountRedeemedin_Year3,																																							
C_AmountRedeemedin_Year4,C_AmountRedeemedin_Year5,																																							
C_AmountRedeemedin_Year6,C_AmountRedeemedin_Year7,																																							
C_AmountRedeemedin_Year8,C_AmountRedeemedin_Year9,																																							
C_AmountRedeemedin_Year10																																							
);																																							
																																							
END LOOP;																																							
																																							
EXCEPTION																																							
WHEN OTHERS THEN																																							
ROLLBACK TO start_tran;																																							
RAISE;																																							
																																							
CLOSE c_CursorAmountOutstanding;																																							
																																							
END; -- End Of cursor																																							
																																							
																																							
COMMIT;																																							
																																							
																																							
END;																																							
																																							
/																																							
--------------------------------------------------------																																							
--  DDL for Procedure USPCURSORSTEPUPINTEREST																																							
--------------------------------------------------------																																							
set define off;																																							
																																							
CREATE OR REPLACE EDITIONABLE PROCEDURE "MS9ABA"."USPCURSORSTEPUPINTEREST"																																							
IS																																							
Begin																																							
																																							
SAVEPOINT start_tran;																																							
																																							
Delete from ms9gsw.TBLSTEPUPINTEREST@TCMA;																																							
Delete from ms9gsw.TBLSTEPUPINTEREST@TCMB;																																							
																																							
DECLARE																																							
																																							
C_ABA0101_SB_SECURITY_CODE  ms9aba.vwStepUpInterest.ABA0101_SB_SECURITY_CODE%Type;																																							
C_ABA0101_SB_ISIN_CODE ms9aba.vwStepUpInterest.ABA0101_SB_ISIN_CODE%Type;																																							
C_ABA0101_SB_ISSUE_DATE ms9aba.vwStepUpInterest.ABA0101_SB_ISSUE_DATE%Type;																																							
C_ABA0101_SB_MATURITY_DATE ms9aba.vwStepUpInterest.ABA0101_SB_MATURITY_DATE%Type;																																							
C_ABA0101_SB_INT_DATE1 ms9aba.vwStepUpInterest.ABA0101_SB_INT_DATE1%Type;																																							
C_ABA0101_SB_INT_DATE2 ms9aba.vwStepUpInterest.ABA0101_SB_INT_DATE2%Type;																																							
C_CouponPercentage_year1 ms9aba.vwStepUpInterest.CouponPercentage_year1%Type;																																							
C_CouponPercentage_year2 ms9aba.vwStepUpInterest.CouponPercentage_year2%Type;																																							
C_CouponPercentage_year3 ms9aba.vwStepUpInterest.CouponPercentage_year3%Type;																																							
C_CouponPercentage_year4 ms9aba.vwStepUpInterest.CouponPercentage_year4%Type;																																							
C_CouponPercentage_year5 ms9aba.vwStepUpInterest.CouponPercentage_year5%Type;																																							
C_CouponPercentage_year6 ms9aba.vwStepUpInterest.CouponPercentage_year6%Type;																																							
C_CouponPercentage_year7 ms9aba.vwStepUpInterest.CouponPercentage_year7%Type;																																							
C_CouponPercentage_year8 ms9aba.vwStepUpInterest.CouponPercentage_year8%Type;																																							
C_CouponPercentage_year9 ms9aba.vwStepUpInterest.CouponPercentage_year9%Type;																																							
C_CouponPercentage_year10 ms9aba.vwStepUpInterest.CouponPercentage_year10%Type;																																							
C_ReturnRatePercentage_year1 ms9aba.vwStepUpInterest.ReturnRatePercentage_year1%Type;																																							
C_ReturnRatePercentage_year2 ms9aba.vwStepUpInterest.ReturnRatePercentage_year2%Type;																																							
C_ReturnRatePercentage_year3 ms9aba.vwStepUpInterest.ReturnRatePercentage_year3%Type;																																							
C_ReturnRatePercentage_year4 ms9aba.vwStepUpInterest.ReturnRatePercentage_year4%Type;																																							
C_ReturnRatePercentage_year5 ms9aba.vwStepUpInterest.ReturnRatePercentage_year5%Type;																																							
C_ReturnRatePercentage_year6 ms9aba.vwStepUpInterest.ReturnRatePercentage_year6%Type;																																							
C_ReturnRatePercentage_year7 ms9aba.vwStepUpInterest.ReturnRatePercentage_year7%Type;																																							
C_ReturnRatePercentage_year8 ms9aba.vwStepUpInterest.ReturnRatePercentage_year8%Type;																																							
C_ReturnRatePercentage_year9 ms9aba.vwStepUpInterest.ReturnRatePercentage_year9%Type;																																							
C_ReturnRatePercentage_year10 ms9aba.vwStepUpInterest.ReturnRatePercentage_year10%Type;																																							
																																							
CURSOR c_CursorSetupInterest is																																							
																																							
select ABA0101_SB_SECURITY_CODE,ABA0101_SB_ISIN_CODE,																																							
ABA0101_SB_ISSUE_DATE,ABA0101_SB_MATURITY_DATE,																																							
ABA0101_SB_INT_DATE1,ABA0101_SB_INT_DATE2,																																							
CouponPercentage_year1, CouponPercentage_year2,																																							
CouponPercentage_year3, CouponPercentage_year4,																																							
CouponPercentage_year5, CouponPercentage_year6,																																							
CouponPercentage_year7, CouponPercentage_year8,																																							
CouponPercentage_year9, CouponPercentage_year10,																																							
ReturnRatePercentage_year1,ReturnRatePercentage_year2,																																							
ReturnRatePercentage_year3,ReturnRatePercentage_year4,																																							
ReturnRatePercentage_year5,ReturnRatePercentage_year6,																																							
ReturnRatePercentage_year7,ReturnRatePercentage_year8,																																							
ReturnRatePercentage_year9,ReturnRatePercentage_year10																																							
from ms9aba.vwStepUpInterest;																																							
																																							
																																							
																																							
BEGIN																																							
OPEN c_CursorSetupInterest;																																							
LOOP																																							
																																							
FETCH c_CursorSetupInterest INTO  C_ABA0101_SB_SECURITY_CODE,C_ABA0101_SB_ISIN_CODE,																																							
C_ABA0101_SB_ISSUE_DATE,C_ABA0101_SB_MATURITY_DATE,																																							
C_ABA0101_SB_INT_DATE1,C_ABA0101_SB_INT_DATE2,																																							
C_CouponPercentage_year1, C_CouponPercentage_year2,																																							
C_CouponPercentage_year3, C_CouponPercentage_year4,																																							
C_CouponPercentage_year5, C_CouponPercentage_year6,																																							
C_CouponPercentage_year7, C_CouponPercentage_year8,																																							
C_CouponPercentage_year9, C_CouponPercentage_year10,																																							
C_ReturnRatePercentage_year1,C_ReturnRatePercentage_year2,																																							
C_ReturnRatePercentage_year3,C_ReturnRatePercentage_year4,																																							
C_ReturnRatePercentage_year5,C_ReturnRatePercentage_year6,																																							
C_ReturnRatePercentage_year7,C_ReturnRatePercentage_year8,																																							
C_ReturnRatePercentage_year9,C_ReturnRatePercentage_year10																																							
																																							
;																																							
																																							
																																							
EXIT WHEN c_CursorSetupInterest%notfound;																																							
																																							
Insert into  ms9gsw.TBLSTEPUPINTEREST@TCMA																																							
(																																							
ABA0101_SB_SECURITY_CODE,  ABA0101_SB_ISIN_CODE,																																							
ABA0101_SB_ISSUE_DATE, ABA0101_SB_MATURITY_DATE,																																							
ABA0101_SB_INT_DATE1, ABA0101_SB_INT_DATE2,																																							
COUPONPERCENTAGE_YEAR1,CouponPercentage_year2,																																							
CouponPercentage_year3, CouponPercentage_year4,																																							
CouponPercentage_year5,CouponPercentage_year6,																																							
CouponPercentage_year7,CouponPercentage_year8,																																							
CouponPercentage_year9,CouponPercentage_year10,																																							
ReturnRatePercentage_year1,ReturnRatePercentage_year2,																																							
ReturnRatePercentage_year3,ReturnRatePercentage_year4,																																							
ReturnRatePercentage_year5,ReturnRatePercentage_year6,																																							
ReturnRatePercentage_year7,ReturnRatePercentage_year8,																																							
ReturnRatePercentage_year9,ReturnRatePercentage_year10																																							
) values																																							
(																																							
C_ABA0101_SB_SECURITY_CODE,C_ABA0101_SB_ISIN_CODE,																																							
C_ABA0101_SB_ISSUE_DATE,C_ABA0101_SB_MATURITY_DATE,																																							
C_ABA0101_SB_INT_DATE1,C_ABA0101_SB_INT_DATE2,																																							
C_CouponPercentage_year1,C_CouponPercentage_year2,																																							
C_CouponPercentage_year3,C_CouponPercentage_year4,																																							
C_CouponPercentage_year5,C_CouponPercentage_year6,																																							
C_CouponPercentage_year7,C_CouponPercentage_year8,																																							
C_CouponPercentage_year9,C_CouponPercentage_year10,																																							
C_ReturnRatePercentage_year1,C_ReturnRatePercentage_year2,																																							
C_ReturnRatePercentage_year3,C_ReturnRatePercentage_year4,																																							
C_ReturnRatePercentage_year5,C_ReturnRatePercentage_year6,																																							
C_ReturnRatePercentage_year7,C_ReturnRatePercentage_year8,																																							
C_ReturnRatePercentage_year9,C_ReturnRatePercentage_year10																																							
);																																							
																																							
																																							
Insert into  ms9gsw.TBLSTEPUPINTEREST@TCMB																																							
(																																							
ABA0101_SB_SECURITY_CODE,  ABA0101_SB_ISIN_CODE,																																							
ABA0101_SB_ISSUE_DATE, ABA0101_SB_MATURITY_DATE,																																							
ABA0101_SB_INT_DATE1, ABA0101_SB_INT_DATE2,																																							
COUPONPERCENTAGE_YEAR1,CouponPercentage_year2,																																							
CouponPercentage_year3, CouponPercentage_year4,																																							
CouponPercentage_year5,CouponPercentage_year6,																																							
CouponPercentage_year7,CouponPercentage_year8,																																							
CouponPercentage_year9,CouponPercentage_year10,																																							
ReturnRatePercentage_year1,ReturnRatePercentage_year2,																																							
ReturnRatePercentage_year3,ReturnRatePercentage_year4,																																							
ReturnRatePercentage_year5,ReturnRatePercentage_year6,																																							
ReturnRatePercentage_year7,ReturnRatePercentage_year8,																																							
ReturnRatePercentage_year9,ReturnRatePercentage_year10																																							
) values																																							
(																																							
C_ABA0101_SB_SECURITY_CODE,C_ABA0101_SB_ISIN_CODE,																																							
C_ABA0101_SB_ISSUE_DATE,C_ABA0101_SB_MATURITY_DATE,																																							
C_ABA0101_SB_INT_DATE1,C_ABA0101_SB_INT_DATE2,																																							
C_CouponPercentage_year1,C_CouponPercentage_year2,																																							
C_CouponPercentage_year3,C_CouponPercentage_year4,																																							
C_CouponPercentage_year5,C_CouponPercentage_year6,																																							
C_CouponPercentage_year7,C_CouponPercentage_year8,																																							
C_CouponPercentage_year9,C_CouponPercentage_year10,																																							
C_ReturnRatePercentage_year1,C_ReturnRatePercentage_year2,																																							
C_ReturnRatePercentage_year3,C_ReturnRatePercentage_year4,																																							
C_ReturnRatePercentage_year5,C_ReturnRatePercentage_year6,																																							
C_ReturnRatePercentage_year7,C_ReturnRatePercentage_year8,																																							
C_ReturnRatePercentage_year9,C_ReturnRatePercentage_year10																																							
);																																							
																																							
																																							
END LOOP;																																							
																																							
EXCEPTION																																							
WHEN OTHERS THEN																																							
ROLLBACK TO start_tran;																																							
RAISE;																																							
																																							
CLOSE c_CursorSetupInterest;																																							
																																							
END; -- End Of cursor																																							
																																							
																																							
COMMIT;																																							
																																							
																																							
END;																																							
																																							
/																																							
--------------------------------------------------------																																							
--  DDL for Function MLAPERIODPRICE																																							
--------------------------------------------------------																																							
																																							
CREATE OR REPLACE EDITIONABLE FUNCTION "MS9ABA"."MLAPERIODPRICE" (issueCode IN ABA0001_SECURITY_MASTER.ABA0001_SECURITY_CODE%TYPE, periodDate IN ABA0017_FINAL_DAILY_PRICE.ABA0017_SUBMISSION_DATE%TYPE) RETURN ABA0017_FINAL_DAILY_PRICE.ABA0017_MLA_PRICE%TYPE IS price NUMBER(7,4); BEGIN SELECT	NVL(ABA0017_MLA_PRICE, 0) INTO price FROM	ABA0017_FINAL_DAILY_PRICE WHERE	ABA0017_SECURITY_CODE = issueCode	AND ABA0017_SUBMISSION_DATE = ( SELECT MAX(ABA0017_SUBMISSION_DATE)					FROM ABA0017_FINAL_DAILY_PRICE					WHERE ABA0017_SUBMISSION_DATE < (periodDate - 14)					AND ABA0017_SUBMISSION_DATE >= (periodDate - 21)					AND TO_CHAR(ABA0017_SUBMISSION_DATE, 'D') NOT IN (1, 7)					AND ABA0017_SUBMISSION_DATE NOT IN (SELECT ABA0019_DATE					FROM ABA0019_PUBLIC_HOLIDAY					WHERE ABA0019_COUNTRY = 'SG')); RETURN price; End;
																																							
																																							
/																																							
--------------------------------------------------------																																							
--  DDL for Function UFNGETCOUPONPERCENTAGE																																							
--------------------------------------------------------																																							
																																							
CREATE OR REPLACE EDITIONABLE FUNCTION "MS9ABA"."UFNGETCOUPONPERCENTAGE" ( IssueCode  CHAR ,vyear  number,CouponNumber  number )																																							
RETURN  Number IS CouponPercentage Number (18,3);																																							
																																							
BEGIN																																							
																																							
select  ABA0124_COUPON_RATE  into CouponPercentage from ABA0124_SB_COUPON_RATE_DETAILS CRD																																							
inner join ABA0101_SB_SECURITY_MASTER SM on SM.ABA0101_SB_SECURITY_CODE = CRD.ABA0124_ISSUE_CODE																																							
and CRD.ABA0124_YEAR_NUMBER =vyear and CRD.ABA0124_COUPON_NUMBER=CouponNumber and CRD.ABA0124_ISSUE_CODE= IssueCode;																																							
																																							
return CouponPercentage;																																							
																																							
END;																																							
																																							
/																																							
--------------------------------------------------------																																							
--  DDL for Function UFNGETRETURNRATEPERCENTAGE																																							
--------------------------------------------------------																																							
																																							
CREATE OR REPLACE EDITIONABLE FUNCTION "MS9ABA"."UFNGETRETURNRATEPERCENTAGE" ( IssueCode  CHAR ,vyear  number,CouponNumber  number )																																							
RETURN  Number IS ReturnRatePercentage Number (18,3);																																							
																																							
BEGIN																																							
																																							
select  ABA0124_RETURN_RATE  into ReturnRatePercentage from ABA0124_SB_COUPON_RATE_DETAILS CRD																																							
inner join ABA0101_SB_SECURITY_MASTER SM on SM.ABA0101_SB_SECURITY_CODE = CRD.ABA0124_ISSUE_CODE																																							
and CRD.ABA0124_YEAR_NUMBER =vyear and CRD.ABA0124_COUPON_NUMBER=CouponNumber and CRD.ABA0124_ISSUE_CODE= IssueCode;																																							
																																							
return ReturnRatePercentage;																																							
																																							
END;																																							
																																							
/																																							
--------------------------------------------------------																																							
--  DDL for Function UFNGETYEARLYREDEMPTIONRESULT																																							
--------------------------------------------------------																																							
																																							
CREATE OR REPLACE EDITIONABLE FUNCTION "MS9ABA"."UFNGETYEARLYREDEMPTIONRESULT" ( IssueDate Date, IssueCode char)																																							
RETURN  Number IS RedemptionResult Number (20);																																							
																																							
BEGIN																																							
																																							
select sum(ABA0126_SB_QTY_REDEEMED)into RedemptionResult from																																							
ABA0126_SB_REDEMPTION_RESULT where ABA0126_SB_SECURITY_CODE=IssueCode																																							
and ABA0126_SB_REDEMPTION_DATE between IssueDate and (add_months( IssueDate, 12 )-1);																																							
																																							
																																							
return RedemptionResult;																																							
																																							
END;																																							
																																							
/																																							
--------------------------------------------------------																																							
--  Constraints for Table ABA0034_EAPPS_SUBMISSION_CUTOFF_TIME																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0034_EAPPS_SUBMISSION_CUTOFF_TIME" MODIFY ("ABA0034_NAME" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0034_EAPPS_SUBMISSION_CUTOFF_TIME" MODIFY ("ABA0034_DEFAULT_CUTOFF_TIME" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0034_EAPPS_SUBMISSION_CUTOFF_TIME" MODIFY ("ABA0034_CUTOFF_TIME" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0034_EAPPS_SUBMISSION_CUTOFF_TIME" ADD CONSTRAINT "UK_ABA0034" UNIQUE ("ABA0034_NAME")																																							
USING INDEX PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP"  ENABLE;																																							
--------------------------------------------------------																																							
--  Constraints for Table ABA0002_FRN_ISSUE																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0002_FRN_ISSUE" MODIFY ("ABA0002_SECURITY_CODE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0002_FRN_ISSUE" MODIFY ("ABA0002_ISSUE_NO" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0002_FRN_ISSUE" ADD CONSTRAINT "PK_ABA0002_FRN_ISSUE" PRIMARY KEY ("ABA0002_SECURITY_CODE", "ABA0002_ISSUE_NO")																																							
USING INDEX PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP"  ENABLE;																																							
--------------------------------------------------------																																							
--  Constraints for Table ABA0010_ANNOUNCE_TEXT																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0010_ANNOUNCE_TEXT" MODIFY ("ABA0010_NAME" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0010_ANNOUNCE_TEXT" MODIFY ("ABA0010_TEXT" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0010_ANNOUNCE_TEXT" ADD CONSTRAINT "PK_ABA0010_ANNOUNCE_TEXT" PRIMARY KEY ("ABA0010_NAME", "ABA0010_USED_BEFORE")																																							
USING INDEX "MS9ABA"."PK_ABA0010_ANNOUNCE_TEXT"  ENABLE;																																							
--------------------------------------------------------																																							
--  Constraints for Table ABA0101_SB_SECURITY_MASTER																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0101_SB_SECURITY_MASTER" MODIFY ("ABA0101_SB_SECURITY_CODE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0101_SB_SECURITY_MASTER" MODIFY ("ABA0101_SB_ISSUE_NO" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0101_SB_SECURITY_MASTER" MODIFY ("ABA0101_SB_SECURITY_NAME" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0101_SB_SECURITY_MASTER" MODIFY ("ABA0101_SB_ISSUE_DATE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0101_SB_SECURITY_MASTER" MODIFY ("ABA0101_SB_TENDER_DATE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0101_SB_SECURITY_MASTER" MODIFY ("ABA0101_SB_ISSUE_SIZE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0101_SB_SECURITY_MASTER" MODIFY ("ABA0101_SB_MATURITY_DATE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0101_SB_SECURITY_MASTER" ADD PRIMARY KEY ("ABA0101_SB_SECURITY_CODE")																																							
USING INDEX PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP"  ENABLE;																																							
--------------------------------------------------------																																							
--  Constraints for Table ABA0503_OPEN_ISSUES																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0503_OPEN_ISSUES" MODIFY ("ABA0503_SECURITY_CODE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0503_OPEN_ISSUES" MODIFY ("ABA0503_UPDATED_DT" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0503_OPEN_ISSUES" ADD CONSTRAINT "PK_ABA0503_OPEN_ISSUES" PRIMARY KEY ("ABA0503_SECURITY_CODE", "ABA0503_UPDATED_DT")																																							
USING INDEX "MS9ABA"."PK_ABA0503_OPEN_ISSUES"  ENABLE;																																							
--------------------------------------------------------																																							
--  Constraints for Table ABA0607_SPLIT_BIDS																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0607_SPLIT_BIDS" MODIFY ("ABA0607_TRANS_REF_NO" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0607_SPLIT_BIDS" MODIFY ("ABA0607_SEQ_NO" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0607_SPLIT_BIDS" ADD CONSTRAINT "PK_ABA0607_SPLIT_BIDS" PRIMARY KEY ("ABA0607_TRANS_REF_NO", "ABA0607_SEQ_NO")																																							
USING INDEX "MS9ABA"."PK_ABA0607_SPLIT_BIDS"  ENABLE;																																							
--------------------------------------------------------																																							
--  Constraints for Table ABA0007_DETAIL_AUCTION_RESULT_20230428																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0007_DETAIL_AUCTION_RESULT_20230428" MODIFY ("ABA0007_SECURITY_CODE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0007_DETAIL_AUCTION_RESULT_20230428" MODIFY ("ABA0007_ISSUE_NO" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0007_DETAIL_AUCTION_RESULT_20230428" MODIFY ("ABA0007_FORM_NO" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0007_DETAIL_AUCTION_RESULT_20230428" MODIFY ("ABA0007_TENDER_DATE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0007_DETAIL_AUCTION_RESULT_20230428" MODIFY ("ABA0007_PRI_DLR_CODE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0007_DETAIL_AUCTION_RESULT_20230428" MODIFY ("ABA0007_FILE_TYPE" NOT NULL ENABLE);																																							
--------------------------------------------------------																																							
--  Constraints for Table ABA0017_FINAL_DAILY_PRICE																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0017_FINAL_DAILY_PRICE" MODIFY ("ABA0017_SECURITY_CODE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0017_FINAL_DAILY_PRICE" MODIFY ("ABA0017_ISSUE_NO" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0017_FINAL_DAILY_PRICE" MODIFY ("ABA0017_SUBMISSION_DATE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0017_FINAL_DAILY_PRICE" ADD CONSTRAINT "PK_ABA0017_FINAL_DAILY_PRICE" PRIMARY KEY ("ABA0017_SECURITY_CODE", "ABA0017_ISSUE_NO", "ABA0017_SUBMISSION_DATE")																																							
USING INDEX "MS9ABA"."PK_ABA0017_FINAL_DAILY_PRICE"  ENABLE;																																							
--------------------------------------------------------																																							
--  Constraints for Table ABA0032_EAPPS_CONFIG																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0032_EAPPS_CONFIG" MODIFY ("ABA0032_KEY" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0032_EAPPS_CONFIG" MODIFY ("ABA0032_VALUE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0032_EAPPS_CONFIG" ADD CONSTRAINT "PK_ABA0032_EAPPS_CONFIG" PRIMARY KEY ("ABA0032_KEY")																																							
USING INDEX PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 65536 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP"  ENABLE;																																							
--------------------------------------------------------																																							
--  Constraints for Table ABA0036_STAGE_SORA_AMMO																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0036_STAGE_SORA_AMMO" MODIFY ("ABA0036_SORA_PUB_DT" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0036_STAGE_SORA_AMMO" MODIFY ("ABA0036_SORA_VALUE_DT" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0036_STAGE_SORA_AMMO" MODIFY ("ABA0036_SORA_RATE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0036_STAGE_SORA_AMMO" MODIFY ("ABA0036_LAST_MODIFIED_BY" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0036_STAGE_SORA_AMMO" ADD PRIMARY KEY ("ABA0036_SORA_PUB_DT")																																							
USING INDEX PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 65536 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP"  ENABLE;																																							
--------------------------------------------------------																																							
--  Constraints for Table ABA0001_SECURITY_MASTER_20230529																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0001_SECURITY_MASTER_20230529" MODIFY ("ABA0001_SECURITY_NAME" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0001_SECURITY_MASTER_20230529" MODIFY ("ABA0001_ISSUE_DATE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0001_SECURITY_MASTER_20230529" MODIFY ("ABA0001_TENDER_DATE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0001_SECURITY_MASTER_20230529" MODIFY ("ABA0001_ISSUE_SIZE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0001_SECURITY_MASTER_20230529" MODIFY ("ABA0001_MATURITY_DATE" NOT NULL ENABLE);																																							
--------------------------------------------------------																																							
--  Constraints for Table ABA0004_RETAIL_BID_TRANS_20230428																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0004_RETAIL_BID_TRANS_20230428" MODIFY ("ABA0004_SECURITY_CODE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0004_RETAIL_BID_TRANS_20230428" MODIFY ("ABA0004_ISSUE_NO" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0004_RETAIL_BID_TRANS_20230428" MODIFY ("ABA0004_BANK_REF_NO" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0004_RETAIL_BID_TRANS_20230428" MODIFY ("ABA0004_FORM_NO" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0004_RETAIL_BID_TRANS_20230428" MODIFY ("ABA0004_FILE_TYPE" NOT NULL ENABLE);																																							
--------------------------------------------------------																																							
--  Constraints for Table ABA0027_BATCH_JOB																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0027_BATCH_JOB" ADD CONSTRAINT "ABA0027_BATCH_JOB_PK" PRIMARY KEY ("ABA0027_JOB_ID")																																							
USING INDEX "MS9ABA"."ABA0027_PK_INDEX"  ENABLE;																																							
ALTER TABLE "MS9ABA"."ABA0027_BATCH_JOB" MODIFY ("ABA0027_JOB_ID" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0027_BATCH_JOB" MODIFY ("ABA0027_JOB_TYPE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0027_BATCH_JOB" MODIFY ("ABA0027_JOB_INSTANCE_ID" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0027_BATCH_JOB" MODIFY ("ABA0027_CREATED_DT" NOT NULL ENABLE);																																							
--------------------------------------------------------																																							
--  Constraints for Table ABA0033_ISSUANCE_REDEMPT_SGS_BKP																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0033_ISSUANCE_REDEMPT_SGS_BKP" MODIFY ("ABA0033_YEAR" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0033_ISSUANCE_REDEMPT_SGS_BKP" ADD UNIQUE ("ABA0033_YEAR", "ABA0033_MONTH", "ABA0033_SECURITY_CATEGORY")																																							
USING INDEX PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP"  ENABLE;																																							
--------------------------------------------------------																																							
--  Constraints for Table FINAL_DAILY_PRICE																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."FINAL_DAILY_PRICE" MODIFY ("ABA0017_SECURITY_CODE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."FINAL_DAILY_PRICE" MODIFY ("ABA0017_ISSUE_NO" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."FINAL_DAILY_PRICE" MODIFY ("ABA0017_SUBMISSION_DATE" NOT NULL ENABLE);																																							
--------------------------------------------------------																																							
--  Constraints for Table ABA0001_SECURITY_MASTER_20230428																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0001_SECURITY_MASTER_20230428" MODIFY ("ABA0001_SECURITY_NAME" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0001_SECURITY_MASTER_20230428" MODIFY ("ABA0001_ISSUE_DATE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0001_SECURITY_MASTER_20230428" MODIFY ("ABA0001_TENDER_DATE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0001_SECURITY_MASTER_20230428" MODIFY ("ABA0001_ISSUE_SIZE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0001_SECURITY_MASTER_20230428" MODIFY ("ABA0001_MATURITY_DATE" NOT NULL ENABLE);																																							
--------------------------------------------------------																																							
--  Constraints for Table ABA0001_SECURITY_MASTER_20230515																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0001_SECURITY_MASTER_20230515" MODIFY ("ABA0001_SECURITY_NAME" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0001_SECURITY_MASTER_20230515" MODIFY ("ABA0001_ISSUE_DATE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0001_SECURITY_MASTER_20230515" MODIFY ("ABA0001_TENDER_DATE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0001_SECURITY_MASTER_20230515" MODIFY ("ABA0001_ISSUE_SIZE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0001_SECURITY_MASTER_20230515" MODIFY ("ABA0001_MATURITY_DATE" NOT NULL ENABLE);																																							
--------------------------------------------------------																																							
--  Constraints for Table ABA0026_OUTSTANDING_MAS																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0026_OUTSTANDING_MAS" MODIFY ("ABA0026_YEAR" NOT NULL ENABLE);																																							
--------------------------------------------------------																																							
--  Constraints for Table ABA0029_SORA_RATE_BKP_20220905																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0029_SORA_RATE_BKP_20220905" MODIFY ("ABA0029_SORA_PUB_DT" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0029_SORA_RATE_BKP_20220905" MODIFY ("ABA0029_SORA_VALUE_DT" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0029_SORA_RATE_BKP_20220905" MODIFY ("ABA0029_SORA_RATE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0029_SORA_RATE_BKP_20220905" MODIFY ("ABA0029_LAST_MODIFIED_DT" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0029_SORA_RATE_BKP_20220905" MODIFY ("ABA0029_LAST_MODIFIED_BY" NOT NULL ENABLE);																																							
--------------------------------------------------------																																							
--  Constraints for Table ABA0124_SB_COUPON_RATE_DETAILS																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0124_SB_COUPON_RATE_DETAILS" MODIFY ("ABA0124_ISSUE_CODE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0124_SB_COUPON_RATE_DETAILS" MODIFY ("ABA0124_YEAR_NUMBER" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0124_SB_COUPON_RATE_DETAILS" MODIFY ("ABA0124_COUPON_NUMBER" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0124_SB_COUPON_RATE_DETAILS" MODIFY ("ABA0124_COUPON_RATE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0124_SB_COUPON_RATE_DETAILS" ADD PRIMARY KEY ("ABA0124_ISSUE_CODE", "ABA0124_YEAR_NUMBER", "ABA0124_COUPON_NUMBER")																																							
USING INDEX PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP"  ENABLE;																																							
--------------------------------------------------------																																							
--  Constraints for Table ABA0610_REJECTED_ISSUES																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0610_REJECTED_ISSUES" MODIFY ("ABA0610_SECURITY_CODE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0610_REJECTED_ISSUES" ADD CONSTRAINT "PK_ABA0610_REJECTED_ISSUES" PRIMARY KEY ("ABA0610_SECURITY_CODE", "ABA0610_UPDATED_DT")																																							
USING INDEX "MS9ABA"."PK_ABA0610_REJECTED_ISSUES"  ENABLE;																																							
--------------------------------------------------------																																							
--  Constraints for Table ABA0009_BANK_MASTER_BKUP2																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0009_BANK_MASTER_BKUP2" MODIFY ("ABA0009_BANK_CODE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0009_BANK_MASTER_BKUP2" MODIFY ("ABA0009_BANK_NAME" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0009_BANK_MASTER_BKUP2" MODIFY ("ABA0009_BANK_SHORTNAME" NOT NULL ENABLE);																																							
--------------------------------------------------------																																							
--  Constraints for Table ABA0036_STAGE_SORA_AMMO_T																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0036_STAGE_SORA_AMMO_T" MODIFY ("ABA0036_SORA_PUB_DT" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0036_STAGE_SORA_AMMO_T" MODIFY ("ABA0036_SORA_VALUE_DT" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0036_STAGE_SORA_AMMO_T" MODIFY ("ABA0036_SORA_RATE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0036_STAGE_SORA_AMMO_T" MODIFY ("ABA0036_LAST_MODIFIED_BY" NOT NULL ENABLE);																																							
--------------------------------------------------------																																							
--  Constraints for Table ABA0603_OPEN_ISSUES																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0603_OPEN_ISSUES" MODIFY ("ABA0603_SECURITY_CODE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0603_OPEN_ISSUES" MODIFY ("ABA0603_OPENED_DT" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0603_OPEN_ISSUES" MODIFY ("ABA0603_UPDATED_DT" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0603_OPEN_ISSUES" ADD CONSTRAINT "PK_ABA0603_OPEN_ISSUES" PRIMARY KEY ("ABA0603_SECURITY_CODE", "ABA0603_UPDATED_DT")																																							
USING INDEX "MS9ABA"."PK_ABA0603_OPEN_ISSUES"  ENABLE;																																							
--------------------------------------------------------																																							
--  Constraints for Table ABA0110_SB_ANNOUNCE_TEXT																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0110_SB_ANNOUNCE_TEXT" MODIFY ("ABA0110_NAME" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0110_SB_ANNOUNCE_TEXT" MODIFY ("ABA0110_USED_BEFORE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0110_SB_ANNOUNCE_TEXT" MODIFY ("ABA0110_TEXT" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0110_SB_ANNOUNCE_TEXT" ADD PRIMARY KEY ("ABA0110_NAME", "ABA0110_USED_BEFORE")																																							
USING INDEX PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP"  ENABLE;																																							
--------------------------------------------------------																																							
--  Constraints for Table ABA0606_SYSTEM_PARM																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0606_SYSTEM_PARM" MODIFY ("ABA0606_MIN_LIMIT_PER_ISSUE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0606_SYSTEM_PARM" MODIFY ("ABA0606_MAX_LIMIT_PER_ISSUE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0606_SYSTEM_PARM" MODIFY ("ABA0606_MAX_LIMIT_ALL_ISSUE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0606_SYSTEM_PARM" MODIFY ("ABA0606_MAX_LIMIT_ALL_INFRA" NOT NULL ENABLE);																																							
--------------------------------------------------------																																							
--  Constraints for Table ABA0608_LEGAL_LOG																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0608_LEGAL_LOG" MODIFY ("ABA0608_BANK_CODE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0608_LEGAL_LOG" MODIFY ("ABA0608_RECEIVED_DT" NOT NULL ENABLE);																																							
--------------------------------------------------------																																							
--  Constraints for Table ABA0013_PRIMARY_DEALER																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0013_PRIMARY_DEALER" MODIFY ("ABA0013_BANK_NAME" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0013_PRIMARY_DEALER" MODIFY ("ABA0013_BANK_SHORTNAME" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0013_PRIMARY_DEALER" MODIFY ("ABA0013_BANK_CODE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0013_PRIMARY_DEALER" ADD CONSTRAINT "PK_ABA0013_PRIMARY_DEALER" PRIMARY KEY ("ABA0013_BANK_CODE")																																							
USING INDEX "MS9ABA"."PK_ABA0013_PRIMARY_DEALER"  ENABLE;																																							
--------------------------------------------------------																																							
--  Constraints for Table ABA0008_STAGE_SECURITY_MASTER																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0008_STAGE_SECURITY_MASTER" MODIFY ("ABA0008_SECURITY_NAME" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0008_STAGE_SECURITY_MASTER" MODIFY ("ABA0008_ISSUE_DATE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0008_STAGE_SECURITY_MASTER" MODIFY ("ABA0008_TENDER_DATE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0008_STAGE_SECURITY_MASTER" MODIFY ("ABA0008_ISSUE_SIZE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0008_STAGE_SECURITY_MASTER" MODIFY ("ABA0008_MATURITY_DATE" NOT NULL ENABLE);																																							
--------------------------------------------------------																																							
--  Constraints for Table ABA0019_PUBLIC_HOLIDAY																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0019_PUBLIC_HOLIDAY" MODIFY ("ABA0019_DATE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0019_PUBLIC_HOLIDAY" ADD CONSTRAINT "PK_ABA0019_PUBLIC_HOLIDAY" PRIMARY KEY ("ABA0019_DATE", "ABA0019_COUNTRY")																																							
USING INDEX "MS9ABA"."PK_ABA0019_PUBLIC_HOLIDAY"  ENABLE;																																							
--------------------------------------------------------																																							
--  Constraints for Table ABA0504_AUCTION_SUMMARY																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0504_AUCTION_SUMMARY" MODIFY ("ABA0504_SECURITY_CODE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0504_AUCTION_SUMMARY" MODIFY ("ABA0504_SETTLEMENT_DATE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0504_AUCTION_SUMMARY" MODIFY ("ABA0504_UPDATED_DT" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0504_AUCTION_SUMMARY" ADD CONSTRAINT "PK_ABA0504_AUCTION_SUMMARY" PRIMARY KEY ("ABA0504_SECURITY_CODE", "ABA0504_UPDATED_DT")																																							
USING INDEX "MS9ABA"."PK_ABA0504_AUCTION_SUMMARY"  ENABLE;																																							
--------------------------------------------------------																																							
--  Constraints for Table ABA2000_TASK_REGISTRY																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA2000_TASK_REGISTRY" MODIFY ("ABA2000_TASK_ID" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA2000_TASK_REGISTRY" ADD CONSTRAINT "PK_ABA2000_TASK" PRIMARY KEY ("ABA2000_TASK_ID")																																							
USING INDEX "MS9ABA"."PK_ABA2000_TASK"  ENABLE;																																							
--------------------------------------------------------																																							
--  Constraints for Table ABA0011_DAILY_PRICE																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0011_DAILY_PRICE" ADD CONSTRAINT "PK_ABA0011_DAILY_PRICE" PRIMARY KEY ("ABA0011_SECURITY_CODE", "ABA0011_ISSUE_NO", "ABA0011_BANK_ACC_CODE", "ABA0011_SUBMISSION_DATE")																																							
USING INDEX "MS9ABA"."PK_ABA0011_DAILY_PRICE"  ENABLE;																																							
ALTER TABLE "MS9ABA"."ABA0011_DAILY_PRICE" MODIFY ("ABA0011_SECURITY_CODE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0011_DAILY_PRICE" MODIFY ("ABA0011_ISSUE_NO" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0011_DAILY_PRICE" MODIFY ("ABA0011_BANK_ACC_CODE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0011_DAILY_PRICE" MODIFY ("ABA0011_SUBMISSION_DATE" NOT NULL ENABLE);																																							
--------------------------------------------------------																																							
--  Constraints for Table ABA0018_FINAL_EXTRA_PRICE																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0018_FINAL_EXTRA_PRICE" MODIFY ("ABA0018_SECURITY_TYPE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0018_FINAL_EXTRA_PRICE" MODIFY ("ABA0018_SUBMISSION_DATE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0018_FINAL_EXTRA_PRICE" ADD CONSTRAINT "PK_ABA0018_FINAL_EXTRA_PRICE" PRIMARY KEY ("ABA0018_SECURITY_TYPE", "ABA0018_SUBMISSION_DATE")																																							
USING INDEX "MS9ABA"."PK_ABA0018_FINAL_EXTRA_PRICE"  ENABLE;																																							
--------------------------------------------------------																																							
--  Constraints for Table ABA0029_SORA_RATE_20230427																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0029_SORA_RATE_20230427" MODIFY ("ABA0029_SORA_PUB_DT" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0029_SORA_RATE_20230427" MODIFY ("ABA0029_SORA_VALUE_DT" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0029_SORA_RATE_20230427" MODIFY ("ABA0029_SORA_RATE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0029_SORA_RATE_20230427" MODIFY ("ABA0029_LAST_MODIFIED_DT" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0029_SORA_RATE_20230427" MODIFY ("ABA0029_LAST_MODIFIED_BY" NOT NULL ENABLE);																																							
--------------------------------------------------------																																							
--  Constraints for Table ABA0031_OUTSTANDING_FRN																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0031_OUTSTANDING_FRN" MODIFY ("ABA0031_YEAR" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0031_OUTSTANDING_FRN" MODIFY ("ABA0031_MONTH" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0031_OUTSTANDING_FRN" ADD CONSTRAINT "ABA0031_OUTSTANDING_FRN_PK" PRIMARY KEY ("ABA0031_YEAR", "ABA0031_MONTH")																																							
USING INDEX PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 65536 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP"  ENABLE;																																							
--------------------------------------------------------																																							
--  Constraints for Table ABA0004_RETAIL_BID_TRANS																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0004_RETAIL_BID_TRANS" MODIFY ("ABA0004_SECURITY_CODE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0004_RETAIL_BID_TRANS" MODIFY ("ABA0004_ISSUE_NO" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0004_RETAIL_BID_TRANS" MODIFY ("ABA0004_BANK_REF_NO" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0004_RETAIL_BID_TRANS" MODIFY ("ABA0004_FORM_NO" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0004_RETAIL_BID_TRANS" MODIFY ("ABA0004_FILE_TYPE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0004_RETAIL_BID_TRANS" ADD CONSTRAINT "PK_ABA0004_RETAIL_BID_TRANS" PRIMARY KEY ("ABA0004_SECURITY_CODE", "ABA0004_ISSUE_NO", "ABA0004_BANK_REF_NO")																																							
USING INDEX PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP"  ENABLE;																																							
--------------------------------------------------------																																							
--  Constraints for Table ABA0028_BATCH_JOB_EXECUTION																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0028_BATCH_JOB_EXECUTION" MODIFY ("ABA0028_JOB_EXECUTION_ID" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0028_BATCH_JOB_EXECUTION" MODIFY ("ABA0028_JOB_ID" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0028_BATCH_JOB_EXECUTION" MODIFY ("ABA0028_JOB_STEP" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0028_BATCH_JOB_EXECUTION" MODIFY ("ABA0028_STEP_STATUS" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0028_BATCH_JOB_EXECUTION" ADD CONSTRAINT "ABA0028_PK" PRIMARY KEY ("ABA0028_JOB_EXECUTION_ID")																																							
USING INDEX "MS9ABA"."ABA0028_PK_INDEX"  ENABLE;																																							
--------------------------------------------------------																																							
--  Constraints for Table ABA0121_SB_ISSUE_CALENDAR																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0121_SB_ISSUE_CALENDAR" MODIFY ("ABA0121_SECURITY_CODE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0121_SB_ISSUE_CALENDAR" MODIFY ("ABA0121_ISSUE_NO" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0121_SB_ISSUE_CALENDAR" ADD PRIMARY KEY ("ABA0121_SECURITY_CODE", "ABA0121_ISSUE_NO")																																							
USING INDEX PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP"  ENABLE;																																							
--------------------------------------------------------																																							
--  Constraints for Table ABA0134_STG_SB_SC_SEC_MASTER																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0134_STG_SB_SC_SEC_MASTER" MODIFY ("ABA0134_SB_SECURITY_CODE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0134_STG_SB_SC_SEC_MASTER" MODIFY ("ABA0134_SB_ISSUE_NO" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0134_STG_SB_SC_SEC_MASTER" MODIFY ("ABA0134_SB_SECURITY_NAME" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0134_STG_SB_SC_SEC_MASTER" MODIFY ("ABA0134_SB_ISSUE_DATE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0134_STG_SB_SC_SEC_MASTER" MODIFY ("ABA0134_SB_TENDER_DATE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0134_STG_SB_SC_SEC_MASTER" MODIFY ("ABA0134_SB_ISSUE_SIZE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0134_STG_SB_SC_SEC_MASTER" MODIFY ("ABA0134_SB_MATURITY_DATE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0134_STG_SB_SC_SEC_MASTER" ADD PRIMARY KEY ("ABA0134_SB_SECURITY_CODE")																																							
USING INDEX PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP"  ENABLE;																																							
--------------------------------------------------------																																							
--  Constraints for Table ABA0009_BANK_MASTER_BKUP3																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0009_BANK_MASTER_BKUP3" MODIFY ("ABA0009_BANK_CODE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0009_BANK_MASTER_BKUP3" MODIFY ("ABA0009_BANK_NAME" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0009_BANK_MASTER_BKUP3" MODIFY ("ABA0009_BANK_SHORTNAME" NOT NULL ENABLE);																																							
--------------------------------------------------------																																							
--  Constraints for Table ABA0022_NON_BENCHMARK																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0022_NON_BENCHMARK" MODIFY ("ABA0022_SECURITY_CODE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0022_NON_BENCHMARK" MODIFY ("ABA0022_ISSUE_NO" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0022_NON_BENCHMARK" ADD CONSTRAINT "PK_ABA0022_NON_BENCHMARK" PRIMARY KEY ("ABA0022_SECURITY_CODE", "ABA0022_ISSUE_NO")																																							
USING INDEX "MS9ABA"."PK_ABA0022_NON_BENCHMARK"  ENABLE;																																							
--------------------------------------------------------																																							
--  Constraints for Table ABA0034_STG_SC_SECURITY_MASTER																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0034_STG_SC_SECURITY_MASTER" MODIFY ("ABA0034_SECURITY_NAME" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0034_STG_SC_SECURITY_MASTER" MODIFY ("ABA0034_ISSUE_DATE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0034_STG_SC_SECURITY_MASTER" MODIFY ("ABA0034_TENDER_DATE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0034_STG_SC_SECURITY_MASTER" MODIFY ("ABA0034_ISSUE_SIZE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0034_STG_SC_SECURITY_MASTER" MODIFY ("ABA0034_MATURITY_DATE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0034_STG_SC_SECURITY_MASTER" ADD CONSTRAINT "PK_ABA0034_STG_SC_MASTER" PRIMARY KEY ("ABA0034_SECURITY_CODE", "ABA0034_ISSUE_NO")																																							
USING INDEX PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP"  ENABLE;																																							
--------------------------------------------------------																																							
--  Constraints for Table ABA0507_SPLIT_BIDS																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0507_SPLIT_BIDS" MODIFY ("ABA0507_TRANS_REF_NO" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0507_SPLIT_BIDS" MODIFY ("ABA0507_SEQ_NO" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0507_SPLIT_BIDS" ADD CONSTRAINT "PK_ABA0507_SPLIT_BIDS" PRIMARY KEY ("ABA0507_TRANS_REF_NO", "ABA0507_SEQ_NO")																																							
USING INDEX "MS9ABA"."PK_ABA0507_SPLIT_BIDS"  ENABLE;																																							
--------------------------------------------------------																																							
--  Constraints for Table ABA0020_STAGING_BANK_MASTER																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0020_STAGING_BANK_MASTER" MODIFY ("ABA0020_BANK_CODE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0020_STAGING_BANK_MASTER" MODIFY ("ABA0020_BANK_NAME" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0020_STAGING_BANK_MASTER" MODIFY ("ABA0020_BANK_SHORTNAME" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0020_STAGING_BANK_MASTER" ADD CONSTRAINT "PK_ABA0020_BANK_MASTER" PRIMARY KEY ("ABA0020_BANK_CODE")																																							
USING INDEX "MS9ABA"."PK_ABA0020_BANK_MASTER"  ENABLE;																																							
--------------------------------------------------------																																							
--  Constraints for Table ABA0001_SECURITY_MASTER_R2_20231212																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0001_SECURITY_MASTER_R2_20231212" MODIFY ("ABA0001_SECURITY_NAME" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0001_SECURITY_MASTER_R2_20231212" MODIFY ("ABA0001_ISSUE_DATE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0001_SECURITY_MASTER_R2_20231212" MODIFY ("ABA0001_TENDER_DATE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0001_SECURITY_MASTER_R2_20231212" MODIFY ("ABA0001_ISSUE_SIZE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0001_SECURITY_MASTER_R2_20231212" MODIFY ("ABA0001_MATURITY_DATE" NOT NULL ENABLE);																																							
--------------------------------------------------------																																							
--  Constraints for Table ABA0004_RETAIL_BID_TRANS_BKP																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0004_RETAIL_BID_TRANS_BKP" MODIFY ("ABA0004_SECURITY_CODE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0004_RETAIL_BID_TRANS_BKP" MODIFY ("ABA0004_ISSUE_NO" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0004_RETAIL_BID_TRANS_BKP" MODIFY ("ABA0004_BANK_REF_NO" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0004_RETAIL_BID_TRANS_BKP" MODIFY ("ABA0004_FORM_NO" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0004_RETAIL_BID_TRANS_BKP" MODIFY ("ABA0004_FILE_TYPE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0004_RETAIL_BID_TRANS_BKP" ADD CONSTRAINT "PK_ABA0004" PRIMARY KEY ("ABA0004_SECURITY_CODE", "ABA0004_ISSUE_NO", "ABA0004_BANK_REF_NO")																																							
USING INDEX PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP"  ENABLE;																																							
--------------------------------------------------------																																							
--  Constraints for Table ABA0021_ISSUE_CALENDAR																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0021_ISSUE_CALENDAR" ADD CONSTRAINT "PK_ABA0021_ISSUE_CALENDAR" PRIMARY KEY ("ABA0021_SECURITY_CODE", "ABA0021_ISSUE_NO")																																							
USING INDEX "MS9ABA"."PK_ABA0021_ISSUE_CALENDAR"  ENABLE;																																							
ALTER TABLE "MS9ABA"."ABA0021_ISSUE_CALENDAR" MODIFY ("ABA0021_SECURITY_CODE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0021_ISSUE_CALENDAR" MODIFY ("ABA0021_ISSUE_NO" NOT NULL ENABLE);																																							
--------------------------------------------------------																																							
--  Constraints for Table ABA0006_AUCTION_RESULT																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0006_AUCTION_RESULT" MODIFY ("ABA0006_SECURITY_CODE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0006_AUCTION_RESULT" MODIFY ("ABA0006_ISSUE_NO" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0006_AUCTION_RESULT" MODIFY ("ABA0006_BANK_ACC_CODE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0006_AUCTION_RESULT" MODIFY ("ABA0006_TENDER_DATE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0006_AUCTION_RESULT" MODIFY ("ABA0006_LINE_NO" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0006_AUCTION_RESULT" ADD CONSTRAINT "PK_ABA0006_AUCTION_RESULT" PRIMARY KEY ("ABA0006_SECURITY_CODE", "ABA0006_ISSUE_NO", "ABA0006_BANK_ACC_CODE", "ABA0006_TENDER_DATE", "ABA0006_LINE_NO")																																							
USING INDEX "MS9ABA"."PK_ABA0006_AUCTION_RESULT"  ENABLE;																																							
--------------------------------------------------------																																							
--  Constraints for Table ABA0012_DP_STATUS																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0012_DP_STATUS" MODIFY ("ABA0012_BANK_ACC_CODE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0012_DP_STATUS" MODIFY ("ABA0012_SUBMISSION_DATE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0012_DP_STATUS" ADD CONSTRAINT "PK_ABA0012_DP_STATUS" PRIMARY KEY ("ABA0012_BANK_ACC_CODE", "ABA0012_SUBMISSION_DATE")																																							
USING INDEX "MS9ABA"."PK_ABA0012_DP_STATUS"  ENABLE;																																							
--------------------------------------------------------																																							
--  Constraints for Table ABA0222_SB_ORG																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0222_SB_ORG" MODIFY ("ABA0222_SB_ORG_ID" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0222_SB_ORG" MODIFY ("ABA0222_SB_ORG_TYPE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0222_SB_ORG" MODIFY ("ABA0222_SB_ORG_CODE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0222_SB_ORG" MODIFY ("ABA0222_SB_ORG_NAME" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0222_SB_ORG" MODIFY ("ABA0222_SB_ORG_NAME_DESC" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0222_SB_ORG" MODIFY ("ABA0222_SB_MEMEBER_CODE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0222_SB_ORG" MODIFY ("ABA0222_SB_CUSTODY_CODE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0222_SB_ORG" ADD CONSTRAINT "ABA0222_SB_ORG_PK" PRIMARY KEY ("ABA0222_SB_ORG_ID")																																							
USING INDEX "MS9ABA"."ABA0222_PK_INDEX"  ENABLE;																																							
--------------------------------------------------------																																							
--  Constraints for Table ABA0505_AUCTION_DETAILS																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0505_AUCTION_DETAILS" MODIFY ("ABA0505_SECURITY_CODE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0505_AUCTION_DETAILS" MODIFY ("ABA0505_BANK_CODE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0505_AUCTION_DETAILS" MODIFY ("ABA0505_SEQ_NO" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0505_AUCTION_DETAILS" MODIFY ("ABA0505_TRANS_REF_NO" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0505_AUCTION_DETAILS" ADD CONSTRAINT "PK_ABA0505_AUCTION_DETAILS" PRIMARY KEY ("ABA0505_SECURITY_CODE", "ABA0505_BANK_CODE", "ABA0505_SEQ_NO", "ABA0505_TRANS_REF_NO")																																							
USING INDEX "MS9ABA"."PK_ABA0505_AUCTION_DETAILS"  ENABLE;																																							
--------------------------------------------------------																																							
--  Constraints for Table ABA0506_SYSTEM_PARM																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0506_SYSTEM_PARM" MODIFY ("ABA0506_CUTOFF_IND" NOT NULL ENABLE);																																							
--------------------------------------------------------																																							
--  Constraints for Table ABA0605_TRADE_DETAILS																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0605_TRADE_DETAILS" MODIFY ("ABA0605_SECURITY_CODE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0605_TRADE_DETAILS" MODIFY ("ABA0605_BANK_CODE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0605_TRADE_DETAILS" MODIFY ("ABA0605_SEQ_NO" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0605_TRADE_DETAILS" MODIFY ("ABA0605_TRANS_REF_NO" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0605_TRADE_DETAILS" ADD CONSTRAINT "PK_ABA0605_TRADE_DETAILS" PRIMARY KEY ("ABA0605_SECURITY_CODE", "ABA0605_BANK_CODE", "ABA0605_SEQ_NO", "ABA0605_TRANS_REF_NO")																																							
USING INDEX "MS9ABA"."PK_ABA0605_TRADE_DETAILS"  ENABLE;																																							
--------------------------------------------------------																																							
--  Constraints for Table ABA0001_SECURITY_MASTER_20230516																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0001_SECURITY_MASTER_20230516" MODIFY ("ABA0001_SECURITY_NAME" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0001_SECURITY_MASTER_20230516" MODIFY ("ABA0001_ISSUE_DATE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0001_SECURITY_MASTER_20230516" MODIFY ("ABA0001_TENDER_DATE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0001_SECURITY_MASTER_20230516" MODIFY ("ABA0001_ISSUE_SIZE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0001_SECURITY_MASTER_20230516" MODIFY ("ABA0001_MATURITY_DATE" NOT NULL ENABLE);																																							
--------------------------------------------------------																																							
--  Constraints for Table ABA0005_RSA_TEXT_ENC_TRANS																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0005_RSA_TEXT_ENC_TRANS" MODIFY ("ABA0005_SECURITY_CODE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0005_RSA_TEXT_ENC_TRANS" MODIFY ("ABA0005_ISSUE_NO" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0005_RSA_TEXT_ENC_TRANS" MODIFY ("ABA0005_BANK_REF_NO" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0005_RSA_TEXT_ENC_TRANS" MODIFY ("ABA0005_REF_NO" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0005_RSA_TEXT_ENC_TRANS" MODIFY ("ABA0005_ENCRYPTED_DATA1" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0005_RSA_TEXT_ENC_TRANS" ADD CONSTRAINT "PK_ABA0005" PRIMARY KEY ("ABA0005_SECURITY_CODE", "ABA0005_ISSUE_NO", "ABA0005_BANK_REF_NO")																																							
USING INDEX "MS9ABA"."PK_ABA0005"  ENABLE;																																							
ALTER TABLE "MS9ABA"."ABA0005_RSA_TEXT_ENC_TRANS" ADD CONSTRAINT "SK_ABA0005" UNIQUE ("ABA0005_SECURITY_CODE", "ABA0005_ISSUE_NO", "ABA0005_REF_NO")																																							
USING INDEX "MS9ABA"."SK_ABA0005"  ENABLE;																																							
--------------------------------------------------------																																							
--  Constraints for Table ABA0006_AUCTION_RESULT_20230428																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0006_AUCTION_RESULT_20230428" MODIFY ("ABA0006_SECURITY_CODE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0006_AUCTION_RESULT_20230428" MODIFY ("ABA0006_ISSUE_NO" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0006_AUCTION_RESULT_20230428" MODIFY ("ABA0006_BANK_ACC_CODE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0006_AUCTION_RESULT_20230428" MODIFY ("ABA0006_TENDER_DATE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0006_AUCTION_RESULT_20230428" MODIFY ("ABA0006_LINE_NO" NOT NULL ENABLE);																																							
--------------------------------------------------------																																							
--  Constraints for Table ABA0126_SB_REDEMPTION_RESULT																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0126_SB_REDEMPTION_RESULT" MODIFY ("ABA0126_SB_REDEMPTION_DATE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0126_SB_REDEMPTION_RESULT" MODIFY ("ABA0126_SB_SECURITY_CODE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0126_SB_REDEMPTION_RESULT" ADD PRIMARY KEY ("ABA0126_SB_REDEMPTION_DATE", "ABA0126_SB_SECURITY_CODE")																																							
USING INDEX PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP"  ENABLE;																																							
--------------------------------------------------------																																							
--  Constraints for Table ABA0025_OUTSTANDING_SGS																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0025_OUTSTANDING_SGS" MODIFY ("ABA0025_YEAR" NOT NULL ENABLE);																																							
--------------------------------------------------------																																							
--  Constraints for Table ABA0033_ISSUANCE_REDEMPT_SGS																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0033_ISSUANCE_REDEMPT_SGS" ADD UNIQUE ("ABA0033_YEAR", "ABA0033_MONTH", "ABA0033_SECURITY_CATEGORY")																																							
USING INDEX PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP"  ENABLE;																																							
ALTER TABLE "MS9ABA"."ABA0033_ISSUANCE_REDEMPT_SGS" MODIFY ("ABA0033_YEAR" NOT NULL ENABLE);																																							
--------------------------------------------------------																																							
--  Constraints for Table ABA0101_SB_SECURITY_MASTER_T																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0101_SB_SECURITY_MASTER_T" MODIFY ("ABA0101_SB_SECURITY_CODE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0101_SB_SECURITY_MASTER_T" MODIFY ("ABA0101_SB_ISSUE_NO" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0101_SB_SECURITY_MASTER_T" MODIFY ("ABA0101_SB_SECURITY_NAME" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0101_SB_SECURITY_MASTER_T" MODIFY ("ABA0101_SB_ISSUE_DATE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0101_SB_SECURITY_MASTER_T" MODIFY ("ABA0101_SB_TENDER_DATE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0101_SB_SECURITY_MASTER_T" MODIFY ("ABA0101_SB_ISSUE_SIZE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0101_SB_SECURITY_MASTER_T" MODIFY ("ABA0101_SB_MATURITY_DATE" NOT NULL ENABLE);																																							
--------------------------------------------------------																																							
--  Constraints for Table ABA0127_SB_SYSTEM_CONFIG																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0127_SB_SYSTEM_CONFIG" ADD PRIMARY KEY ("ABA0127_SB_PROPERTY_NAME")																																							
USING INDEX PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP"  ENABLE;																																							
ALTER TABLE "MS9ABA"."ABA0127_SB_SYSTEM_CONFIG" MODIFY ("ABA0127_SB_PROPERTY_NAME" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0127_SB_SYSTEM_CONFIG" MODIFY ("ABA0127_SB_PROPERTY_VALUE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0127_SB_SYSTEM_CONFIG" MODIFY ("ABA0127_SB_CREATED_DT" NOT NULL ENABLE);																																							
--------------------------------------------------------																																							
--  Constraints for Table ABA0001_SECURITY_MASTER_20230512																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0001_SECURITY_MASTER_20230512" MODIFY ("ABA0001_SECURITY_NAME" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0001_SECURITY_MASTER_20230512" MODIFY ("ABA0001_ISSUE_DATE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0001_SECURITY_MASTER_20230512" MODIFY ("ABA0001_TENDER_DATE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0001_SECURITY_MASTER_20230512" MODIFY ("ABA0001_ISSUE_SIZE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0001_SECURITY_MASTER_20230512" MODIFY ("ABA0001_MATURITY_DATE" NOT NULL ENABLE);																																							
--------------------------------------------------------																																							
--  Constraints for Table ABA0009_BANK_MASTER_BKUP4																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0009_BANK_MASTER_BKUP4" MODIFY ("ABA0009_BANK_CODE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0009_BANK_MASTER_BKUP4" MODIFY ("ABA0009_BANK_NAME" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0009_BANK_MASTER_BKUP4" MODIFY ("ABA0009_BANK_SHORTNAME" NOT NULL ENABLE);																																							
--------------------------------------------------------																																							
--  Constraints for Table ABA0029_SORA_RATE																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0029_SORA_RATE" ADD PRIMARY KEY ("ABA0029_SORA_PUB_DT")																																							
USING INDEX PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP"  ENABLE;																																							
ALTER TABLE "MS9ABA"."ABA0029_SORA_RATE" MODIFY ("ABA0029_SORA_PUB_DT" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0029_SORA_RATE" MODIFY ("ABA0029_SORA_VALUE_DT" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0029_SORA_RATE" MODIFY ("ABA0029_SORA_RATE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0029_SORA_RATE" MODIFY ("ABA0029_LAST_MODIFIED_DT" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0029_SORA_RATE" MODIFY ("ABA0029_LAST_MODIFIED_BY" NOT NULL ENABLE);																																							
--------------------------------------------------------																																							
--  Constraints for Table ABA0214_SB_CD_FILE_TYPE																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0214_SB_CD_FILE_TYPE" MODIFY ("ABA0214_SB_CD_FILE_TYPE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0214_SB_CD_FILE_TYPE" MODIFY ("ABA0214_SB_DESCRIPTION" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0214_SB_CD_FILE_TYPE" MODIFY ("ABA0214_SB_OBS_IND" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0214_SB_CD_FILE_TYPE" ADD CONSTRAINT "ABA0214_SB_CD_FILE_TYPE_PK" PRIMARY KEY ("ABA0214_SB_CD_FILE_TYPE")																																							
USING INDEX "MS9ABA"."ABA0214_PK_INDEX"  ENABLE;																																							
--------------------------------------------------------																																							
--  Constraints for Table ABA0005_RSA_TEXT_ENC_TRANS_20230428																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0005_RSA_TEXT_ENC_TRANS_20230428" MODIFY ("ABA0005_SECURITY_CODE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0005_RSA_TEXT_ENC_TRANS_20230428" MODIFY ("ABA0005_ISSUE_NO" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0005_RSA_TEXT_ENC_TRANS_20230428" MODIFY ("ABA0005_BANK_REF_NO" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0005_RSA_TEXT_ENC_TRANS_20230428" MODIFY ("ABA0005_REF_NO" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0005_RSA_TEXT_ENC_TRANS_20230428" MODIFY ("ABA0005_ENCRYPTED_DATA1" NOT NULL ENABLE);																																							
--------------------------------------------------------																																							
--  Constraints for Table ABA0009_BANK_MASTER																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0009_BANK_MASTER" ADD CONSTRAINT "PK_ABA0009_BANK_MASTER" PRIMARY KEY ("ABA0009_BANK_CODE")																																							
USING INDEX "MS9ABA"."PK_ABA0009_BANK_MASTER"  ENABLE;																																							
ALTER TABLE "MS9ABA"."ABA0009_BANK_MASTER" MODIFY ("ABA0009_BANK_CODE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0009_BANK_MASTER" MODIFY ("ABA0009_BANK_NAME" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0009_BANK_MASTER" MODIFY ("ABA0009_BANK_SHORTNAME" NOT NULL ENABLE);																																							
--------------------------------------------------------																																							
--  Constraints for Table ABA0031_OUTSTANDING_FRN_BKP																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0031_OUTSTANDING_FRN_BKP" MODIFY ("ABA0031_YEAR" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0031_OUTSTANDING_FRN_BKP" MODIFY ("ABA0031_MONTH" NOT NULL ENABLE);																																							
--------------------------------------------------------																																							
--  Constraints for Table ABA0035_RETAILBID_FILE_TMP																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0035_RETAILBID_FILE_TMP" MODIFY ("ABA0035_BANK_ACC_CODE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0035_RETAILBID_FILE_TMP" MODIFY ("ABA0035_PROCESSING_DATE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0035_RETAILBID_FILE_TMP" MODIFY ("ABA0035_FILE_NAME" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0035_RETAILBID_FILE_TMP" MODIFY ("ABA0035_FILE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0035_RETAILBID_FILE_TMP" MODIFY ("ABA0035_MODIFIED_TIME" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0035_RETAILBID_FILE_TMP" MODIFY ("ABA0035_MODIFIED_USER_ID" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0035_RETAILBID_FILE_TMP" ADD CONSTRAINT "UK_ABA0035_TMP" UNIQUE ("ABA0035_BANK_ACC_CODE", "ABA0035_PROCESSING_DATE", "ABA0035_FILE_NAME")																																							
USING INDEX PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 65536 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP"  ENABLE;																																							
--------------------------------------------------------																																							
--  Constraints for Table ABA0108_SB_STAGE_SEC_MASTER																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0108_SB_STAGE_SEC_MASTER" MODIFY ("ABA0108_SB_SECURITY_CODE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0108_SB_STAGE_SEC_MASTER" MODIFY ("ABA0108_SB_ISSUE_NO" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0108_SB_STAGE_SEC_MASTER" MODIFY ("ABA0108_SB_SECURITY_NAME" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0108_SB_STAGE_SEC_MASTER" MODIFY ("ABA0108_SB_ISSUE_DATE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0108_SB_STAGE_SEC_MASTER" MODIFY ("ABA0108_SB_TENDER_DATE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0108_SB_STAGE_SEC_MASTER" MODIFY ("ABA0108_SB_ISSUE_SIZE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0108_SB_STAGE_SEC_MASTER" MODIFY ("ABA0108_SB_MATURITY_DATE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0108_SB_STAGE_SEC_MASTER" ADD PRIMARY KEY ("ABA0108_SB_SECURITY_CODE")																																							
USING INDEX PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP"  ENABLE;																																							
--------------------------------------------------------																																							
--  Constraints for Table ABA0007_DETAIL_AUCTION_RESULT																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0007_DETAIL_AUCTION_RESULT" MODIFY ("ABA0007_SECURITY_CODE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0007_DETAIL_AUCTION_RESULT" MODIFY ("ABA0007_ISSUE_NO" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0007_DETAIL_AUCTION_RESULT" MODIFY ("ABA0007_FORM_NO" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0007_DETAIL_AUCTION_RESULT" MODIFY ("ABA0007_TENDER_DATE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0007_DETAIL_AUCTION_RESULT" MODIFY ("ABA0007_PRI_DLR_CODE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0007_DETAIL_AUCTION_RESULT" MODIFY ("ABA0007_FILE_TYPE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0007_DETAIL_AUCTION_RESULT" ADD CONSTRAINT "PK_ABA0007_IND_AUCT_RESULT" PRIMARY KEY ("ABA0007_SECURITY_CODE", "ABA0007_ISSUE_NO", "ABA0007_FORM_NO")																																							
USING INDEX "MS9ABA"."PK_ABA0007_IND_AUCT_RESULT"  ENABLE;																																							
--------------------------------------------------------																																							
--  Constraints for Table ABA0022_NON_BENCHMARK_20230428																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0022_NON_BENCHMARK_20230428" MODIFY ("ABA0022_SECURITY_CODE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0022_NON_BENCHMARK_20230428" MODIFY ("ABA0022_ISSUE_NO" NOT NULL ENABLE);																																							
--------------------------------------------------------																																							
--  Constraints for Table ABA0015_PRICE_SPREAD																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0015_PRICE_SPREAD" ADD CONSTRAINT "PK_ABA0015_PRICE_SPREAD" PRIMARY KEY ("ABA0015_TYPE")																																							
USING INDEX "MS9ABA"."PK_ABA0015_PRICE_SPREAD"  ENABLE;																																							
--------------------------------------------------------																																							
--  Constraints for Table ABA0016_DAILY_EXTRA_DATA																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0016_DAILY_EXTRA_DATA" MODIFY ("ABA0016_BANK_ACC_CODE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0016_DAILY_EXTRA_DATA" MODIFY ("ABA0016_SUBMISSION_DATE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0016_DAILY_EXTRA_DATA" ADD CONSTRAINT "PK_ABA0016_DAILY_EXTRA_DATA" PRIMARY KEY ("ABA0016_BANK_ACC_CODE", "ABA0016_SUBMISSION_DATE")																																							
USING INDEX "MS9ABA"."PK_ABA0016_DAILY_EXTRA_DATA"  ENABLE;																																							
--------------------------------------------------------																																							
--  Constraints for Table ABA0223_SB_PGP_CONFIG																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0223_SB_PGP_CONFIG" MODIFY ("ABA0223_SB_PGP_PROPERTY_KEY" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0223_SB_PGP_CONFIG" MODIFY ("ABA0223_SB_PGP_PROPERTY_VALUE" NOT NULL ENABLE);																																							
--------------------------------------------------------																																							
--  Constraints for Table ABA0501_ENCRYPTED_REPO_TRANS																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0501_ENCRYPTED_REPO_TRANS" MODIFY ("ABA0501_BANK_CODE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0501_ENCRYPTED_REPO_TRANS" MODIFY ("ABA0501_TRANS_REF_NO" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0501_ENCRYPTED_REPO_TRANS" MODIFY ("ABA0501_RECEIVED_DT" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0501_ENCRYPTED_REPO_TRANS" ADD CONSTRAINT "PK_ABA0501_ENCRYPTED_REPO" PRIMARY KEY ("ABA0501_BANK_CODE", "ABA0501_TRANS_REF_NO", "ABA0501_RECEIVED_DT")																																							
USING INDEX "MS9ABA"."PK_ABA0501_ENCRYPTED_REPO"  ENABLE;																																							
--------------------------------------------------------																																							
--  Constraints for Table ABA0601_ENCRYPTED_REPO_TRANS																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0601_ENCRYPTED_REPO_TRANS" MODIFY ("ABA0601_BANK_CODE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0601_ENCRYPTED_REPO_TRANS" MODIFY ("ABA0601_TRANS_REF_NO" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0601_ENCRYPTED_REPO_TRANS" MODIFY ("ABA0601_RECEIVED_DT" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0601_ENCRYPTED_REPO_TRANS" ADD CONSTRAINT "PK_ABA0601_ENCRYPTED_REPO" PRIMARY KEY ("ABA0601_BANK_CODE", "ABA0601_TRANS_REF_NO", "ABA0601_RECEIVED_DT")																																							
USING INDEX "MS9ABA"."PK_ABA0601_ENCRYPTED_REPO"  ENABLE;																																							
--------------------------------------------------------																																							
--  Constraints for Table ABA0023_AUDIT_ACTION																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0023_AUDIT_ACTION" MODIFY ("ABA0023_MODULE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0023_AUDIT_ACTION" MODIFY ("ABA0023_ACTION" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0023_AUDIT_ACTION" MODIFY ("ABA0023_USERID" NOT NULL ENABLE);																																							
--------------------------------------------------------																																							
--  Constraints for Table ABA0001_SECURITY_MASTER_T																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0001_SECURITY_MASTER_T" MODIFY ("ABA0001_SECURITY_NAME" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0001_SECURITY_MASTER_T" MODIFY ("ABA0001_ISSUE_DATE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0001_SECURITY_MASTER_T" MODIFY ("ABA0001_TENDER_DATE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0001_SECURITY_MASTER_T" MODIFY ("ABA0001_ISSUE_SIZE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0001_SECURITY_MASTER_T" MODIFY ("ABA0001_MATURITY_DATE" NOT NULL ENABLE);																																							
--------------------------------------------------------																																							
--  Constraints for Table ABA0035_RETAILBID_FILE																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0035_RETAILBID_FILE" MODIFY ("ABA0035_BANK_ACC_CODE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0035_RETAILBID_FILE" MODIFY ("ABA0035_PROCESSING_DATE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0035_RETAILBID_FILE" MODIFY ("ABA0035_FILE_NAME" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0035_RETAILBID_FILE" MODIFY ("ABA0035_FILE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0035_RETAILBID_FILE" MODIFY ("ABA0035_MODIFIED_TIME" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0035_RETAILBID_FILE" MODIFY ("ABA0035_MODIFIED_USER_ID" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0035_RETAILBID_FILE" ADD CONSTRAINT "UK_ABA0035" UNIQUE ("ABA0035_BANK_ACC_CODE", "ABA0035_PROCESSING_DATE", "ABA0035_FILE_NAME")																																							
USING INDEX PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP"  ENABLE;																																							
--------------------------------------------------------																																							
--  Constraints for Table ABA0001_SECURITY_MASTER																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0001_SECURITY_MASTER" MODIFY ("ABA0001_SECURITY_NAME" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0001_SECURITY_MASTER" MODIFY ("ABA0001_ISSUE_DATE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0001_SECURITY_MASTER" MODIFY ("ABA0001_TENDER_DATE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0001_SECURITY_MASTER" MODIFY ("ABA0001_ISSUE_SIZE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0001_SECURITY_MASTER" MODIFY ("ABA0001_MATURITY_DATE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0001_SECURITY_MASTER" ADD CONSTRAINT "PK_ABA0001_SECURITY_MASTER" PRIMARY KEY ("ABA0001_SECURITY_CODE", "ABA0001_ISSUE_NO")																																							
USING INDEX "MS9ABA"."PK_ABA0001_SECURITY_MASTER"  ENABLE;																																							
--------------------------------------------------------																																							
--  Constraints for Table ABA0001_SECURITY_MASTER_20230601																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0001_SECURITY_MASTER_20230601" MODIFY ("ABA0001_SECURITY_NAME" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0001_SECURITY_MASTER_20230601" MODIFY ("ABA0001_ISSUE_DATE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0001_SECURITY_MASTER_20230601" MODIFY ("ABA0001_TENDER_DATE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0001_SECURITY_MASTER_20230601" MODIFY ("ABA0001_ISSUE_SIZE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0001_SECURITY_MASTER_20230601" MODIFY ("ABA0001_MATURITY_DATE" NOT NULL ENABLE);																																							
--------------------------------------------------------																																							
--  Constraints for Table ABA0009_BANK_MASTER_BKUP1																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0009_BANK_MASTER_BKUP1" MODIFY ("ABA0009_BANK_CODE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0009_BANK_MASTER_BKUP1" MODIFY ("ABA0009_BANK_NAME" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0009_BANK_MASTER_BKUP1" MODIFY ("ABA0009_BANK_SHORTNAME" NOT NULL ENABLE);																																							
--------------------------------------------------------																																							
--  Constraints for Table ABA0029_SORA_RATE_BKUP																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0029_SORA_RATE_BKUP" MODIFY ("ABA0029_SORA_PUB_DT" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0029_SORA_RATE_BKUP" MODIFY ("ABA0029_SORA_VALUE_DT" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0029_SORA_RATE_BKUP" MODIFY ("ABA0029_SORA_RATE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0029_SORA_RATE_BKUP" MODIFY ("ABA0029_LAST_MODIFIED_DT" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0029_SORA_RATE_BKUP" MODIFY ("ABA0029_LAST_MODIFIED_BY" NOT NULL ENABLE);																																							
--------------------------------------------------------																																							
--  Constraints for Table ABA0009_BANK_MASTER_BKUP																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0009_BANK_MASTER_BKUP" MODIFY ("ABA0009_BANK_CODE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0009_BANK_MASTER_BKUP" MODIFY ("ABA0009_BANK_NAME" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0009_BANK_MASTER_BKUP" MODIFY ("ABA0009_BANK_SHORTNAME" NOT NULL ENABLE);																																							
--------------------------------------------------------																																							
--  Constraints for Table ABA0030_CORP_PASS_MAPPING																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0030_CORP_PASS_MAPPING" MODIFY ("ABA0030_BANK_CODE" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0030_CORP_PASS_MAPPING" MODIFY ("ABA0030_CP_ENTITY_ID" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0030_CORP_PASS_MAPPING" MODIFY ("ABA0030_CP_UID" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0030_CORP_PASS_MAPPING" MODIFY ("ABA0030_TOKEN_USER_ID" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0030_CORP_PASS_MAPPING" MODIFY ("ABA0030_ACTIVE_IND" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0030_CORP_PASS_MAPPING" MODIFY ("ABA0030_LAST_MODIFIED_DT" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0030_CORP_PASS_MAPPING" MODIFY ("ABA0030_UPDATED_BY" NOT NULL ENABLE);																																							
ALTER TABLE "MS9ABA"."ABA0030_CORP_PASS_MAPPING" ADD CONSTRAINT "ABA0030_CORP_PASS_MAPPING_PK" PRIMARY KEY ("ABA0030_BANK_CODE", "ABA0030_CP_ENTITY_ID", "ABA0030_CP_UID")																																							
USING INDEX PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 65536 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP"  ENABLE;																																							
ALTER TABLE "MS9ABA"."ABA0030_CORP_PASS_MAPPING" ADD CONSTRAINT "ABA0030_CORP_PASS_MAPPING_UK" UNIQUE ("ABA0030_TOKEN_USER_ID")																																							
USING INDEX PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS																																							
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645																																							
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1																																							
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)																																							
TABLESPACE "NETAPP"  ENABLE;																																							
--------------------------------------------------------																																							
--  Ref Constraints for Table ABA0002_FRN_ISSUE																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0002_FRN_ISSUE" ADD CONSTRAINT "FK_ABA0002_FRN_ISSUE" FOREIGN KEY ("ABA0002_SECURITY_CODE", "ABA0002_ISSUE_NO")																																							
	REFERENCES "MS9ABA"."ABA0001_SECURITY_MASTER" ("ABA0001_SECURITY_CODE", "ABA0001_ISSUE_NO") ENABLE;																																						
--------------------------------------------------------																																							
--  Ref Constraints for Table ABA0005_RSA_TEXT_ENC_TRANS																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0005_RSA_TEXT_ENC_TRANS" ADD CONSTRAINT "FK_ABA0005" FOREIGN KEY ("ABA0005_SECURITY_CODE", "ABA0005_ISSUE_NO")																																							
	REFERENCES "MS9ABA"."ABA0001_SECURITY_MASTER" ("ABA0001_SECURITY_CODE", "ABA0001_ISSUE_NO") ENABLE;																																						
--------------------------------------------------------																																							
--  Ref Constraints for Table ABA0006_AUCTION_RESULT																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0006_AUCTION_RESULT" ADD CONSTRAINT "FK_ABA0006_AUCTION_RESULT" FOREIGN KEY ("ABA0006_SECURITY_CODE", "ABA0006_ISSUE_NO")																																							
	REFERENCES "MS9ABA"."ABA0001_SECURITY_MASTER" ("ABA0001_SECURITY_CODE", "ABA0001_ISSUE_NO") ENABLE;																																						
--------------------------------------------------------																																							
--  Ref Constraints for Table ABA0008_STAGE_SECURITY_MASTER																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0008_STAGE_SECURITY_MASTER" ADD CONSTRAINT "FK_ABA0008_STAGE" FOREIGN KEY ("ABA0008_SECURITY_CODE", "ABA0008_ISSUE_NO")																																							
	REFERENCES "MS9ABA"."ABA0001_SECURITY_MASTER" ("ABA0001_SECURITY_CODE", "ABA0001_ISSUE_NO") ENABLE;																																						
--------------------------------------------------------																																							
--  Ref Constraints for Table ABA0011_DAILY_PRICE																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0011_DAILY_PRICE" ADD CONSTRAINT "FK_ABA0011_DAILY_PRICE" FOREIGN KEY ("ABA0011_SECURITY_CODE", "ABA0011_ISSUE_NO")																																							
	REFERENCES "MS9ABA"."ABA0001_SECURITY_MASTER" ("ABA0001_SECURITY_CODE", "ABA0001_ISSUE_NO") ENABLE;																																						
--------------------------------------------------------																																							
--  Ref Constraints for Table ABA0017_FINAL_DAILY_PRICE																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0017_FINAL_DAILY_PRICE" ADD CONSTRAINT "FK_ABA0017_FINAL_DAILY_PRICE" FOREIGN KEY ("ABA0017_SECURITY_CODE", "ABA0017_ISSUE_NO")																																							
	REFERENCES "MS9ABA"."ABA0001_SECURITY_MASTER" ("ABA0001_SECURITY_CODE", "ABA0001_ISSUE_NO") ENABLE;																																						
--------------------------------------------------------																																							
--  Ref Constraints for Table ABA0022_NON_BENCHMARK																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0022_NON_BENCHMARK" ADD CONSTRAINT "FK_ABA0022_NON_BENCHMARK" FOREIGN KEY ("ABA0022_SECURITY_CODE", "ABA0022_ISSUE_NO")																																							
	REFERENCES "MS9ABA"."ABA0001_SECURITY_MASTER" ("ABA0001_SECURITY_CODE", "ABA0001_ISSUE_NO") ENABLE;																																						
--------------------------------------------------------																																							
--  Ref Constraints for Table ABA0028_BATCH_JOB_EXECUTION																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0028_BATCH_JOB_EXECUTION" ADD CONSTRAINT "FK_ABA_028_027_JOB_ID" FOREIGN KEY ("ABA0028_JOB_ID")																																							
	REFERENCES "MS9ABA"."ABA0027_BATCH_JOB" ("ABA0027_JOB_ID") ENABLE;																																						
--------------------------------------------------------																																							
--  Ref Constraints for Table ABA0124_SB_COUPON_RATE_DETAILS																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0124_SB_COUPON_RATE_DETAILS" ADD FOREIGN KEY ("ABA0124_ISSUE_CODE")																																							
	REFERENCES "MS9ABA"."ABA0101_SB_SECURITY_MASTER" ("ABA0101_SB_SECURITY_CODE") ENABLE;																																						
--------------------------------------------------------																																							
--  Ref Constraints for Table ABA0126_SB_REDEMPTION_RESULT																																							
--------------------------------------------------------																																							
																																							
ALTER TABLE "MS9ABA"."ABA0126_SB_REDEMPTION_RESULT" ADD FOREIGN KEY ("ABA0126_SB_SECURITY_CODE")																																							
	REFERENCES "MS9ABA"."ABA0101_SB_SECURITY_MASTER" ("ABA0101_SB_SECURITY_CODE") ENABLE;																																						
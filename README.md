Managing files with Node.js and MongoDB GridFSBucket


SELECT
    XMLSERIALIZE(CONTENT
        XMLAGG(
            XMLELEMENT("OrderTransactions",
                XMLELEMENT("Order",
                    XMLFOREST(
                        JSON_VALUE(json_data, '$.OrderTransactions.Order.TransactionDateTime') AS "TransactionDateTime",
                        JSON_VALUE(json_data, '$.OrderTransactions.Order.OrgCode') AS "OrgCode",
                        JSON_VALUE(json_data, '$.OrderTransactions.Order.SourceTransactionID') AS "SourceTransactionID",
                        JSON_VALUE(json_data, '$.OrderTransactions.Order.SourceUser') AS "SourceUser",
                        JSON_VALUE(json_data, '$.OrderTransactions.Order.SourceReferenceNumber') AS "SourceReferenceNumber",
                        JSON_VALUE(json_data, '$.OrderTransactions.Order.OracleOrderType') AS "OracleOrderType",
                        JSON_VALUE(json_data, '$.OrderTransactions.Order.QuoteName') AS "QuoteName",
                        JSON_VALUE(json_data, '$.OrderTransactions.Order.CustomerAccountNumber') AS "CustomerAccountNumber",
                        JSON_VALUE(json_data, '$.OrderTransactions.Order.PrimarySalesPersonAssociateID') AS "PrimarySalesPersonAssociateID",
                        JSON_VALUE(json_data, '$.OrderTransactions.Order.BookPriceName') AS "BookPriceName",
                        JSON_VALUE(json_data, '$.OrderTransactions.Order.AutoSubmitFlag') AS "AutoSubmitFlag",
                        XMLAGG(
                            XMLELEMENT("AddressContact",
                                XMLFOREST(
                                    JSON_VALUE(ac.value, '$.AddressUse') AS "AddressUse",
                                    JSON_VALUE(ac.value, '$.AddressLine1') AS "AddressLine1",
                                    JSON_VALUE(ac.value, '$.AddressLine2') AS "AddressLine2",
                                    JSON_VALUE(ac.value, '$.City') AS "City",
                                    JSON_VALUE(ac.value, '$.State') AS "State",
                                    JSON_VALUE(ac.value, '$.County') AS "County",
                                    JSON_VALUE(ac.value, '$.Zip') AS "Zip",
                                    JSON_VALUE(ac.value, '$.Country') AS "Country",
                                    JSON_VALUE(ac.value, '$.ContactLastName') AS "ContactLastName",
                                    JSON_VALUE(ac.value, '$.ContactFirstName') AS "ContactFirstName",
                                    JSON_VALUE(ac.value, '$.ContactPhone') AS "ContactPhone",
                                    JSON_VALUE(ac.value, '$.ContactEmail') AS "ContactEmail"
                                ) AS "AddressContact"
                            )
                        ) AS "AddressContact",
                        JSON_VALUE(json_data, '$.OrderTransactions.Order.OrderComment') AS "OrderComment",
                        XMLAGG(
                            XMLELEMENT("Entity",
                                XMLFOREST(
                                    JSON_VALUE(en.value, '$.RevenueRegion') AS "RevenueRegion",
                                    JSON_VALUE(en.value, '$.ProductCode') AS "ProductCode",
                                    JSON_VALUE(en.value, '$.CompanyCode') AS "CompanyCode",
                                    JSON_VALUE(en.value, '$.OrderEntityType') AS "OrderEntityType",
                                    JSON_VALUE(en.value, '$.InputMethod') AS "InputMethod",
                                    JSON_VALUE(en.value, '$.RevenueSortCode') AS "RevenueSortCode",
                                    JSON_VALUE(en.value, '$.PriceType') AS "PriceType",
                                    JSON_VALUE(en.value, '$.PEName') AS "PEName",
                                    JSON_VALUE(en.value, '$.ParentCompanyCode') AS "ParentCompanyCode",
                                    JSON_VALUE(en.value, '$.PaymentMethod') AS "PaymentMethod",
                                    JSON_VALUE(en.value, '$.BankAccountId') AS "BankAccountId",
                                    JSON_VALUE(en.value, '$.PaymentTerms') AS "PaymentTerms",
                                    JSON_VALUE(en.value, '$.GroupInvoicingFlag') AS "GroupInvoicingFlag",
                                    JSON_VALUE(en.value, '$.InvoiceFrequency') AS "InvoiceFrequency",
                                    JSON_VALUE(en.value, '$.InvoiceDeliveryMethod') AS "InvoiceDeliveryMethod",
                                    JSON_VALUE(en.value, '$.InvoiceDeliveryEmailAddress') AS "InvoiceDeliveryEmailAddress",
                                    XMLAGG(
                                        XMLELEMENT("Feature",
                                            XMLFOREST(
                                                JSON_VALUE(f.value, '$.ItemNumber') AS "ItemNumber",
                                                JSON_VALUE(f.value, '$.LineActionType') AS "LineActionType",
                                                JSON_VALUE(f.value, '$.Volume') AS "Volume",
                                                JSON_VALUE(f.value, '$.ProcessingFrequency') AS "ProcessingFrequency",
                                                JSON_VALUE(f.value, '$.ProcessingCycles') AS "ProcessingCycles",
                                                JSON_VALUE(f.value, '$.PriceStructureType') AS "PriceStructureType",
                                                JSON_VALUE(f.value, '$.ListRate') AS "ListRate",
                                                JSON_VALUE(f.value, '$.MinPrice') AS "MinPrice",
                                                JSON_VALUE(f.value, '$.BasePrice') AS "BasePrice",
                                                JSON_VALUE(f.value, '$.DiscountPercent') AS "DiscountPercent",
                                                JSON_VALUE(f.value, '$.EstimatedStartDate') AS "EstimatedStartDate",
                                                JSON_VALUE(f.value, '$.ImplExcepCode') AS "ImplExcepCode",
                                                JSON_VALUE(f.value, '$.RollcallableFlag') AS "RollcallableFlag",
                                                JSON_VALUE(f.value, '$.SBNRFlag') AS "SBNRFlag",
                                                XMLELEMENT("DM",
                                                    XMLFOREST(
                                                        JSON_VALUE(f.value, '$.DM.AssociateID') AS "AssociateID",
                                                        JSON_VALUE(f.value, '$.DM.PrimaryFlag') AS "PrimaryFlag"
                                                    )
                                                ) AS "DM"
                                            )
                                        )
                                    ) AS "Feature"
                                )
                            )
                        ) AS "Entity"
                    )
                )
            )
        ) AS CLOB INDENT SIZE = 2
    ) AS xml_data
FROM
    (
        SELECT json_data
        FROM (
            SELECT '{
              "OrderTransactions": {
                 "Order": {
                    "TransactionDateTime": "2021-12-02T21:08:01.7673608",
                    "OrgCode": "ADP_ES",
                    "SourceTransactionID": 2021120201,
                    "SourceUser": "PPULA01",
                    "SourceReferenceNumber": 2021120201,
                    "OracleOrderType": "New Product Entity",
                    "QuoteName": "5NewPEsTestQuote_202112021",
                    "CustomerAccountNumber": 90646,
                    "PrimarySalesPersonAssociateID": 883038,
                    "BookPriceName": "400 MAJORS PRICELIST 072808",
                    "AutoSubmitFlag": "Y",
                    "AddressContact": [
                       {
                          "AddressUse": "BILL_TO",
                          "AddressLine1": "1 ADP BLVD",
                          "AddressLine2": "",
                          "City": "ROSELAND",
                          "State": "NJ",
                          "County": "",
                          "Zip": 7068,
                          "Country": "US",
                          "ContactLastName": "AVLN1",
                          "ContactFirstName": "AVFN1",
                          "ContactPhone": 9089089089,
                          "ContactEmail": "silpa.putti@adp.com"
                       },
                       {
                          "AddressUse": "BILL_TO",
                          "AddressLine1": "1 ADP BLVD",
                          "AddressLine2": "",
                          "City": "ROSELAND",
                          "State": "NJ",
                          "County": "",
                          "Zip": 7068,
                          "Country": "US",
                          "ContactLastName": "AVLN1",
                          "ContactFirstName": "AVFN1",
                          "ContactPhone": 9089089089,
                          "ContactEmail": "silpa.putti@adp.com"
                       }
                    ],
                    "OrderComment": "Order related t",
                    "Entity": [
                       {
                          "RevenueRegion": 218,
                          "ProductCode": 10,
                          "CompanyCode": 120201,
                          "OrderEntityType": "NEW",
                          "InputMethod": "TELEDATA",
                          "RevenueSortCode": "PX",
                          "PriceType": "BL",
                          "PEName": "Nice Product Entity",
                          "ParentCompanyCode": "KY1",
                          "PaymentMethod": "DIRECT_DEBIT",
                          "BankAccountId": 1036295,
                          "PaymentTerms": "NET 7 DAYS",
                          "GroupInvoicingFlag": "Y",
                          "InvoiceFrequency": "WKLY",
                          "InvoiceDeliveryMethod": "EMAIL",
                          "InvoiceDeliveryEmailAddress": "1234567890@gmail.com",
                          "Feature": [
                             {
                                "ItemNumber": "10-F00033",
                                "LineActionType": "ADD",
                                "Volume": 2,
                                "ProcessingFrequency": "EVERY",
                                "ProcessingCycles": 12,
                                "PriceStructureType": "S",
                                "ListRate": 0,
                                "MinPrice": 0,
                                "BasePrice": 3500,
                                "DiscountPercent": 0,
                                "EstimatedStartDate": "2015-08-28",
                                "ImplExcepCode": "ESTRTORD",
                                "RollcallableFlag": "N",
                                "SBNRFlag": "N",
                                "DM": {
                                   "AssociateID": 883038,
                                   "PrimaryFlag": "Y"
                                }
                             }
                          ]
                       },
                       {
                          "RevenueRegion": 218,
                          "ProductCode": 100,
                          "CompanyCode": 120201,
                          "OrderEntityType": "NEW",
                          "InputMethod": "TELEDATA",
                          "RevenueSortCode": "PX",
                          "PriceType": "BL",
                          "PEName": "Nice Product Entity",
                          "ParentCompanyCode": "KY1",
                          "PaymentMethod": "DIRECT_DEBIT",
                          "BankAccountId": 1036295,
                          "PaymentTerms": "NET 7 DAYS",
                          "GroupInvoicingFlag": "Y",
                          "InvoiceFrequency": "WKLY",
                          "InvoiceDeliveryMethod": "EMAIL",
                          "InvoiceDeliveryEmailAddress": "1234567890@gmail.com",
                          "Feature": [
                             {
                                "ItemNumber": "10-F00033",
                                "LineActionType": "SUB",
                                "Volume": 2,
                                "ProcessingFrequency": "EVERY",
                                "ProcessingCycles": 12,
                                "PriceStructureType": "S",
                                "ListRate": 0,
                                "MinPrice": 0,
                                "BasePrice": 3500,
                                "DiscountPercent": 0,
                                "EstimatedStartDate": "2015-08-28",
                                "ImplExcepCode": "ESTRTORD",
                                "RollcallableFlag": "N",
                                "SBNRFlag": "N",
                                "DM": {
                                   "AssociateID": 883038,
                                   "PrimaryFlag": "Y"
                                }
                             }
                          ]
                       }
                    ]
                 }
              }
           }' AS json_data FROM dual
        )
    )
    CROSS JOIN
        JSON_TABLE(json_data, '$.OrderTransactions.Order.AddressContact[*]' COLUMNS (
            value PATH '$'
        )) ac
    CROSS JOIN
        JSON_TABLE(json_data, '$.OrderTransactions.Order.Entity[*]' COLUMNS (
            value PATH '$',
            NESTED PATH '$.Feature[*]' COLUMNS (
                f PATH '$'
            )
        )) en
GROUP BY
    json_data;

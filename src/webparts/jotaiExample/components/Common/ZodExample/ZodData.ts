import { z } from "zod";
import * as moment from "moment";
import { DateTimeFormat } from "../../../Shared/constants/Constants";
import { useAtomValue } from "jotai";
import { appGlobalStateAtom } from "../../../jotai/appGlobalStateAtom";
const dateFormatter = new Intl.DateTimeFormat([], {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short",
});
// Setup schema

/**
 * this below Schema is Used for the getItemsByQuery 
 */
const FormResultSchema = z.object({
    Title: z.string().nullable().optional(),
    FirstName: z.string().nullable().optional(),
    MiddleName: z.string().nullable().optional(),
    ID: z.number().nullable().optional(),
    LastName: z.string().nullable().optional(),
    ClientName: z.string().nullable().optional(),
    EmailAddress: z.string().nullable().optional(),
    PhoneNumber: z.string().nullable().optional(),
    ClientStatus: z.string().nullable().optional(),
    Industry: z.string().nullable().optional(),
    Website: z.string().nullable().optional(),
    ClientAddress: z.string().nullable().optional(),
    ClientCode: z.string(),
    Modified: z.string().nullable().optional().transform((value) => (value ? moment(new Date(value)).format(DateTimeFormat) : "")),
    UserId: z.number().nullable().optional(),
    User: z.object({ Title: z.string().nullable().optional() }).nullable().optional().transform((value) => (value && value.Title ? value.Title : "")),
    RepresentativeId: z.array(z.number().optional().nullable()).optional().nullable(),
    Representative: z.array(z.object({ Title: z.string() }).transform((value) => value.Title)).nullable().optional(),
    City: z.array(z.object({ Title: z.string() }).transform((data) => data.Title)).nullable().optional(),
    Technology: z.array(z.string().nullable().optional()).nullable().optional(),
    IsDelete: z.boolean().nullable().optional(),
    Image: z.string().nullable().optional().nullable().optional().transform((value: any) => !!value ? JSON.parse(value).fileName : ""),
    AttachmentFiles: z.array(z.object({ ServerRelativeUrl: z.string().optional().nullable() })).optional().nullable()
});
const FormResultsSchema = z.array(FormResultSchema);

// Generate type from schema
type FormResultModel = z.infer<typeof FormResultSchema>;
type FormResultsModel = z.infer<typeof FormResultsSchema>;

export { FormResultsSchema, FormResultModel, FormResultsModel };

/**
 * this below Schema is Used for the getItemsByCamelQuery 
 */

const ClientListCamelQuery = z.object({
    Title: z.string().nullable().optional(),
    FirstName: z.string().nullable().optional(),
    MiddleName: z.string().nullable().optional(),
    ID: z.string().nullable().optional(),
    LastName: z.string().nullable().optional(),
    ClientName: z.string().nullable().optional(),
    EmailAddress: z.string().nullable().optional(),
    PhoneNumber: z.string().nullable().optional(),
    ClientStatus: z.string().nullable().optional(),
    Industry: z.string().nullable().optional(),
    Website: z.string().nullable().optional(),
    ClientAddress: z.string().nullable().optional(),
    ClientCode: z.string().nullable().optional(),
    Modified: z.string().nullable().optional().transform((value) => (value ? moment(new Date(value)).format(DateTimeFormat) : "")),
    User: z.union([z.string().nullable().optional(), z.array(z.object({ id: z.string().nullable().optional(), title: z.string().nullable().optional() })).nullable().optional()]),
    City: z.array(z.object({ lookupValue: z.string() }).transform((data) => data.lookupValue)).nullable().optional(),
    Technology: z.union([z.string().nullable().optional(), z.array(z.string().nullable().optional()).nullable().optional()]),
    IsDelete: z.string().nullable().optional(),
    Image: z.union([z.string().nullable().optional(), z.object({ fileName: z.string() }).nullable().optional().transform((value: any) => value.fileName)]),
    Representative: z.union([z.string().nullable().optional(), z.array(z.object({ id: z.string(), title: z.string() }).optional().nullable()).nullable().optional()]),
});
const ClientListCamelQuerySchema = z.array(ClientListCamelQuery);

// Generate type from schema
type ClientListResultModel = z.infer<typeof ClientListCamelQuery>;
type ClientListResultsModel = z.infer<typeof ClientListCamelQuerySchema>;

export { ClientListCamelQuerySchema, ClientListResultModel, ClientListResultsModel };



const LibrarySchemaData = z.object({
    DocumentStatus: z.string().nullable().optional(),
    FileDirRef: z.string().nullable().optional(),
    FileLeafRef: z.string().nullable().optional(),
    FileRef: z.string().nullable().optional(),
    Title: z.string().nullable().optional(),
    FSObjType: z.string().nullable().optional(),
    File_x0020_Size: z.string().nullable().optional(),
    DocumentTitle: z.string().nullable().optional(),
    DocumentCategory: z.string().nullable().optional(),
    DocumentSubcategory: z.string().nullable().optional(),
    DocumentKeyword: z.string().nullable().optional(),
    Modified: z.string().nullable().optional().transform((value) => (value ? moment(new Date(value)).format(DateTimeFormat) : "")),
    ClientName: z.union([z.string().nullable().optional(), z.array(z.object({ lookupValue: z.string() }).transform((data) => data.lookupValue)).nullable().optional()]),
});
const LibrarySchema = z.array(LibrarySchemaData);

// Generate type from schema
type LibraryResultModel = z.infer<typeof LibrarySchemaData>;
type LibraryResultsModel = z.infer<typeof LibrarySchema>;

export { LibrarySchema, LibraryResultModel, LibraryResultsModel };
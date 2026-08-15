"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdvancesModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const advance_request_schema_1 = require("../../schemas/advance-request.schema");
const user_schema_1 = require("../../schemas/user.schema");
const advances_service_1 = require("./advances.service");
const advances_controller_1 = require("./advances.controller");
let AdvancesModule = class AdvancesModule {
};
exports.AdvancesModule = AdvancesModule;
exports.AdvancesModule = AdvancesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: advance_request_schema_1.AdvanceRequest.name, schema: advance_request_schema_1.AdvanceRequestSchema },
                { name: user_schema_1.User.name, schema: user_schema_1.UserSchema },
            ]),
        ],
        controllers: [advances_controller_1.AdvancesController],
        providers: [advances_service_1.AdvancesService],
        exports: [advances_service_1.AdvancesService],
    })
], AdvancesModule);
//# sourceMappingURL=advances.module.js.map
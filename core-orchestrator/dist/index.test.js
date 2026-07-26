"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_test_1 = require("node:test");
const node_assert_1 = __importDefault(require("node:assert"));
const index_1 = __importDefault(require("./index"));
(0, node_test_1.describe)('App', () => {
    (0, node_test_1.it)('should exist', () => {
        node_assert_1.default.ok(index_1.default);
    });
});

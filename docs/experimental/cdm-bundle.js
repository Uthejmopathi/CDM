(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.cdm = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){

},{}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const perf_hooks_1 = require("perf_hooks");
////////////////////////////////////////////////////////////////////////////////////////////////////
//  enums
////////////////////////////////////////////////////////////////////////////////////////////////////
var cdmObjectType;
(function (cdmObjectType) {
    cdmObjectType[cdmObjectType["unresolved"] = 0] = "unresolved";
    cdmObjectType[cdmObjectType["cdmObject"] = 1] = "cdmObject";
    cdmObjectType[cdmObjectType["import"] = 2] = "import";
    cdmObjectType[cdmObjectType["stringConstant"] = 3] = "stringConstant";
    cdmObjectType[cdmObjectType["genericRef"] = 4] = "genericRef";
    cdmObjectType[cdmObjectType["argumentDef"] = 5] = "argumentDef";
    cdmObjectType[cdmObjectType["parameterDef"] = 6] = "parameterDef";
    cdmObjectType[cdmObjectType["traitDef"] = 7] = "traitDef";
    cdmObjectType[cdmObjectType["traitRef"] = 8] = "traitRef";
    cdmObjectType[cdmObjectType["relationshipDef"] = 9] = "relationshipDef";
    cdmObjectType[cdmObjectType["relationshipRef"] = 10] = "relationshipRef";
    cdmObjectType[cdmObjectType["dataTypeDef"] = 11] = "dataTypeDef";
    cdmObjectType[cdmObjectType["dataTypeRef"] = 12] = "dataTypeRef";
    cdmObjectType[cdmObjectType["typeAttributeDef"] = 13] = "typeAttributeDef";
    cdmObjectType[cdmObjectType["entityAttributeDef"] = 14] = "entityAttributeDef";
    cdmObjectType[cdmObjectType["attributeGroupDef"] = 15] = "attributeGroupDef";
    cdmObjectType[cdmObjectType["attributeGroupRef"] = 16] = "attributeGroupRef";
    cdmObjectType[cdmObjectType["constantEntityDef"] = 17] = "constantEntityDef";
    cdmObjectType[cdmObjectType["constantEntityRef"] = 18] = "constantEntityRef";
    cdmObjectType[cdmObjectType["entityDef"] = 19] = "entityDef";
    cdmObjectType[cdmObjectType["entityRef"] = 20] = "entityRef";
    cdmObjectType[cdmObjectType["documentDef"] = 21] = "documentDef";
    cdmObjectType[cdmObjectType["folderDef"] = 22] = "folderDef";
})(cdmObjectType = exports.cdmObjectType || (exports.cdmObjectType = {}));
var cdmTraitSet;
(function (cdmTraitSet) {
    cdmTraitSet[cdmTraitSet["all"] = 0] = "all";
    cdmTraitSet[cdmTraitSet["elevatedOnly"] = 1] = "elevatedOnly";
    cdmTraitSet[cdmTraitSet["inheritedOnly"] = 2] = "inheritedOnly";
    cdmTraitSet[cdmTraitSet["appliedOnly"] = 3] = "appliedOnly";
})(cdmTraitSet = exports.cdmTraitSet || (exports.cdmTraitSet = {}));
var cdmValidationStep;
(function (cdmValidationStep) {
    cdmValidationStep[cdmValidationStep["start"] = 0] = "start";
    cdmValidationStep[cdmValidationStep["imports"] = 1] = "imports";
    cdmValidationStep[cdmValidationStep["integrity"] = 2] = "integrity";
    cdmValidationStep[cdmValidationStep["declarations"] = 3] = "declarations";
    cdmValidationStep[cdmValidationStep["references"] = 4] = "references";
    cdmValidationStep[cdmValidationStep["parameters"] = 5] = "parameters";
    cdmValidationStep[cdmValidationStep["traits"] = 6] = "traits";
    cdmValidationStep[cdmValidationStep["attributes"] = 7] = "attributes";
    cdmValidationStep[cdmValidationStep["entityReferences"] = 8] = "entityReferences";
    cdmValidationStep[cdmValidationStep["cleanup"] = 9] = "cleanup";
    cdmValidationStep[cdmValidationStep["finished"] = 10] = "finished";
    cdmValidationStep[cdmValidationStep["error"] = 11] = "error";
})(cdmValidationStep = exports.cdmValidationStep || (exports.cdmValidationStep = {}));
var cdmStatusLevel;
(function (cdmStatusLevel) {
    cdmStatusLevel[cdmStatusLevel["info"] = 0] = "info";
    cdmStatusLevel[cdmStatusLevel["progress"] = 1] = "progress";
    cdmStatusLevel[cdmStatusLevel["warning"] = 2] = "warning";
    cdmStatusLevel[cdmStatusLevel["error"] = 3] = "error";
})(cdmStatusLevel = exports.cdmStatusLevel || (exports.cdmStatusLevel = {}));
class ApplierContinuationSet {
    constructor() {
        //let bodyCode = () =>
        {
            this.continuations = new Array();
        }
        //return p.measure(bodyCode);
    }
}
class profile {
    constructor() {
        this.calls = new Map();
        this.callStack = new Array();
    }
    measure(code) {
        let stack = new Error().stack;
        let start = stack.indexOf(" at ", 13) + 4;
        let end = stack.indexOf("(", start);
        let loc = stack.slice(start, end);
        start = stack.indexOf("js:", end) + 3;
        end = stack.indexOf(":", start);
        loc += ":" + stack.slice(start, end);
        this.callStack.push(loc);
        let cnt = this.calls.get(loc);
        if (!cnt) {
            cnt = { calls: 0, timeTotal: 0, timeExl: 0 };
            this.calls.set(loc, cnt);
        }
        cnt.calls++;
        let n = perf_hooks_1.performance.now();
        let retVal = code();
        let elaspsed = perf_hooks_1.performance.now() - n;
        if (elaspsed < 0)
            elaspsed = .00001;
        cnt.timeTotal += elaspsed;
        this.callStack.pop();
        if (this.callStack.length) {
            let locFrom = this.callStack[this.callStack.length - 1];
            cnt = this.calls.get(locFrom);
            cnt.timeExl += elaspsed;
        }
        return retVal;
    }
    report() {
        //let s = new Map([...this.calls.entries()].sort((a, b) => by == 0 ? (b[1].calls - a[1].calls) : (by == 1 ? (b[1].timeTotal - a[1].timeTotal))));
        this.calls.forEach((v, k) => {
            console.log(`${v.calls},${v.timeTotal},${v.timeTotal - v.timeExl},${k}`);
        });
    }
}
let p = new profile();
let visits;
function trackVisits(path) {
    if (!visits)
        visits = new Map();
    let cnt = 0;
    if (visits.has(path)) {
        cnt = visits.get(path) + 1;
    }
    visits.set(path, cnt);
    if (path == "Case/hasAttributes/attributesAddedAtThisScope/members/(unspecified)")
        return true;
}
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
//
//  classes for resolution of refereneces and representing constructed traits, attributes and relationships
//
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
//  parameters and arguments in traits
////////////////////////////////////////////////////////////////////////////////////////////////////
class ParameterCollection {
    constructor(prior) {
        //let bodyCode = () =>
        {
            if (prior && prior.sequence)
                this.sequence = prior.sequence.slice();
            else
                this.sequence = new Array();
            if (prior && prior.lookup)
                this.lookup = new Map(prior.lookup);
            else
                this.lookup = new Map();
            if (prior && prior.ordinals)
                this.ordinals = new Map(prior.ordinals);
            else
                this.ordinals = new Map();
        }
        //return p.measure(bodyCode);
    }
    add(element) {
        //let bodyCode = () =>
        {
            // if there is already a named parameter that matches, this is trouble
            let name = element.getName();
            if (name && this.lookup.has(name))
                throw new Error(`duplicate parameter named '${name}'`);
            if (name)
                this.lookup.set(name, element);
            this.ordinals.set(element, this.sequence.length);
            this.sequence.push(element);
        }
        //return p.measure(bodyCode);
    }
    resolveParameter(ordinal, name) {
        //let bodyCode = () =>
        {
            if (name) {
                if (this.lookup.has(name))
                    return this.lookup.get(name);
                throw new Error(`there is no parameter named '${name}'`);
            }
            if (ordinal >= this.sequence.length)
                throw new Error(`too many arguments supplied`);
            return this.sequence[ordinal];
        }
        //return p.measure(bodyCode);
    }
    getParameterIndex(pName) {
        //let bodyCode = () =>
        {
            return this.ordinals.get(this.lookup.get(pName));
        }
        //return p.measure(bodyCode);
    }
}
exports.ParameterCollection = ParameterCollection;
class ParameterValue {
    constructor(param, value) {
        //let bodyCode = () =>
        {
            this.parameter = param;
            this.value = value;
        }
        //return p.measure(bodyCode);
    }
    get valueString() {
        //let bodyCode = () =>
        {
            let value = this.value;
            if (value) {
                // if a string constant, call get value to turn into itself or a reference if that is what is held there
                if (value.getObjectType() == cdmObjectType.stringConstant)
                    value = value.getValue();
                // if still  a string, it is just a string
                if (value.getObjectType() == cdmObjectType.stringConstant)
                    return value.getConstant();
                // if this is a constant table, then expand into an html table
                if (value.getObjectType() == cdmObjectType.entityRef && value.getObjectDef().getObjectType() == cdmObjectType.constantEntityDef) {
                    var entShape = value.getObjectDef().getEntityShape();
                    var entValues = value.getObjectDef().getConstantValues();
                    if (!entValues && entValues.length == 0)
                        return "";
                    let rows = new Array();
                    var shapeAtts = entShape.getResolvedAttributes();
                    let l = shapeAtts.set.length;
                    for (var r = 0; r < entValues.length; r++) {
                        var rowData = entValues[r];
                        if (rowData && rowData.length) {
                            let row = {};
                            for (var c = 0; c < rowData.length; c++) {
                                var tvalue = rowData[c];
                                row[shapeAtts.set[c].resolvedName] = tvalue;
                            }
                            rows.push(row);
                        }
                    }
                    return JSON.stringify(rows);
                }
                return value.getObjectDef().getName();
            }
            return "";
        }
        //return p.measure(bodyCode);
    }
    get name() {
        //let bodyCode = () =>
        {
            return this.parameter.getName();
        }
        //return p.measure(bodyCode);
    }
    setValue(newValue) {
        //let bodyCode = () =>
        {
            this.value = ParameterValue.getReplacementValue(this.value, newValue);
        }
        //return p.measure(bodyCode);
    }
    static getReplacementValue(oldValue, newValue) {
        //let bodyCode = () =>
        {
            if (oldValue && (oldValue.objectType == cdmObjectType.entityRef)) {
                let oldEnt = oldValue.getObjectDef();
                let newEnt = newValue.getObjectDef();
                // check that the entities are the same shape
                if (oldEnt.getEntityShape() != oldEnt.getEntityShape())
                    return newValue;
                let oldCv = oldEnt.getConstantValues();
                let newCv = newEnt.getConstantValues();
                // rows in old?
                if (!oldCv || oldCv.length == 0)
                    return newValue;
                // rows in new?
                if (!newCv || newCv.length == 0)
                    return oldValue;
                // find rows in the new one that are not in the old one. slow, but these are small usually
                let appendedRows = new Array();
                let lNew = newCv.length;
                let lOld = oldCv.length;
                for (let iNew = 0; iNew < lNew; iNew++) {
                    let newRow = newCv[iNew];
                    let lCol = newRow.length;
                    let iOld = 0;
                    for (; iOld < lOld; iOld++) {
                        let oldRow = oldCv[iOld];
                        let iCol = 0;
                        for (; iCol < lCol; iCol++) {
                            if (newRow[iCol] != oldRow[iCol])
                                break;
                        }
                        if (iCol < lCol)
                            break;
                    }
                    if (iOld < lOld) {
                        appendedRows.push(newRow);
                    }
                }
                if (!appendedRows.length)
                    return newValue;
                let replacementEnt = oldEnt.copy();
                let allRows = replacementEnt.getConstantValues().slice(0).concat(appendedRows);
                replacementEnt.setConstantValues(allRows);
                return Corpus.MakeRef(cdmObjectType.entityRef, replacementEnt);
            }
            return newValue;
        }
        //return p.measure(bodyCode);
    }
    spew(indent) {
        //let bodyCode = () =>
        {
            console.log(`${indent}${this.name}:${this.valueString}`);
        }
        //return p.measure(bodyCode);
    }
}
exports.ParameterValue = ParameterValue;
class ParameterValueSet {
    constructor(pc, values) {
        //let bodyCode = () =>
        {
            this.pc = pc;
            this.values = values;
        }
        //return p.measure(bodyCode);
    }
    get length() {
        //let bodyCode = () =>
        {
            if (this.pc && this.pc.sequence)
                return this.pc.sequence.length;
            return 0;
        }
        //return p.measure(bodyCode);
    }
    indexOf(paramDef) {
        //let bodyCode = () =>
        {
            return this.pc.ordinals.get(paramDef);
        }
        //return p.measure(bodyCode);
    }
    getParameter(i) {
        //let bodyCode = () =>
        {
            return this.pc.sequence[i];
        }
        //return p.measure(bodyCode);
    }
    getValue(i) {
        //let bodyCode = () =>
        {
            return this.values[i];
        }
        //return p.measure(bodyCode);
    }
    getValueString(i) {
        //let bodyCode = () =>
        {
            return new ParameterValue(this.pc.sequence[i], this.values[i]).valueString;
        }
        //return p.measure(bodyCode);        
    }
    getParameterValue(pName) {
        //let bodyCode = () =>
        {
            let i = this.pc.getParameterIndex(pName);
            return new ParameterValue(this.pc.sequence[i], this.values[i]);
        }
        //return p.measure(bodyCode);
    }
    setParameterValue(pName, value) {
        //let bodyCode = () =>
        {
            let i = this.pc.getParameterIndex(pName);
            let v;
            if (typeof (value) === "string")
                v = new StringConstant(cdmObjectType.unresolved, value);
            else
                v = value;
            this.values[i] = ParameterValue.getReplacementValue(this.values[i], v);
        }
        //return p.measure(bodyCode);
    }
    copy() {
        //let bodyCode = () =>
        {
            let copyValues = this.values.slice(0);
            let copy = new ParameterValueSet(this.pc, copyValues);
            return copy;
        }
        //return p.measure(bodyCode);
    }
    spew(indent) {
        //let bodyCode = () =>
        {
            let l = this.length;
            for (let i = 0; i < l; i++) {
                let pv = new ParameterValue(this.pc.sequence[i], this.values[i]);
                pv.spew(indent + '-');
            }
        }
        //return p.measure(bodyCode);
    }
}
exports.ParameterValueSet = ParameterValueSet;
////////////////////////////////////////////////////////////////////////////////////////////////////
//  resolved traits
////////////////////////////////////////////////////////////////////////////////////////////////////
class ResolvedTrait {
    constructor(trait, pc, values) {
        //let bodyCode = () =>
        {
            this.parameterValues = new ParameterValueSet(pc, values);
            this.trait = trait;
        }
        //return p.measure(bodyCode);
    }
    get traitName() {
        //let bodyCode = () =>
        {
            return this.trait.getName();
        }
        //return p.measure(bodyCode);
    }
    spew(indent) {
        //let bodyCode = () =>
        {
            console.log(`${indent}[${this.traitName}]`);
            this.parameterValues.spew(indent + '-');
        }
        //return p.measure(bodyCode);
    }
    copy() {
        //let bodyCode = () =>
        {
            let copyParamValues = this.parameterValues.copy();
            let copy = new ResolvedTrait(this.trait, copyParamValues.pc, copyParamValues.values);
            return copy;
        }
        //return p.measure(bodyCode);
    }
    collectTraitNames(into) {
        //let bodyCode = () =>
        {
            // get the name of this trait and all of its base classes
            let t = this.trait;
            while (t) {
                let name = t.getName();
                if (!into.has(name))
                    into.add(name);
                let baseRef = t.getExtendsTrait();
                t = baseRef ? baseRef.getObjectDef() : null;
            }
        }
        //return p.measure(bodyCode);
    }
}
exports.ResolvedTrait = ResolvedTrait;
class refCounted {
    constructor() {
        //let bodyCode = () =>
        {
            this.refCnt = 0;
        }
        //return p.measure(bodyCode);
    }
    addRef() {
        //let bodyCode = () =>
        {
            this.refCnt++;
        }
        //return p.measure(bodyCode);
    }
    release() {
        //let bodyCode = () =>
        {
            this.refCnt--;
        }
        //return p.measure(bodyCode);
    }
}
let __rtsMergeOne = 0;
class ResolvedTraitSet extends refCounted {
    constructor() {
        super();
        //let bodyCode = () =>
        {
            this.set = new Array();
            this.lookupByTrait = new Map();
        }
        //return p.measure(bodyCode);
    }
    merge(toMerge, copyOnWrite, forAtt = null) {
        //let bodyCode = () =>
        {
            __rtsMergeOne++;
            let traitSetResult = this;
            //toMerge = toMerge.copy();
            let trait = toMerge.trait;
            let pc = toMerge.parameterValues.pc;
            let av = toMerge.parameterValues.values;
            if (traitSetResult.lookupByTrait.has(trait)) {
                let rtOld = traitSetResult.lookupByTrait.get(trait);
                let avOld = rtOld.parameterValues.values;
                // the new values take precedence
                let l = av.length;
                for (let i = 0; i < l; i++) {
                    if (av[i] != avOld[i]) {
                        if (traitSetResult === this && copyOnWrite) {
                            traitSetResult = traitSetResult.shallowCopyWithException(trait); // copy on write
                            rtOld = traitSetResult.lookupByTrait.get(trait);
                            avOld = rtOld.parameterValues.values;
                        }
                        avOld[i] = ParameterValue.getReplacementValue(avOld[i], av[i]);
                    }
                    if (forAtt) {
                        let strConst = avOld[i];
                        if (strConst && strConst.constantValue && strConst.constantValue === "this.attribute" && strConst.resolvedReference !== forAtt) {
                            if (traitSetResult === this && copyOnWrite) {
                                traitSetResult = traitSetResult.shallowCopyWithException(trait); // copy on write
                                rtOld = traitSetResult.lookupByTrait.get(trait);
                                avOld = rtOld.parameterValues.values;
                            }
                            avOld[i] = ParameterValue.getReplacementValue(avOld[i], av[i]);
                        }
                    }
                }
            }
            else {
                if (this.refCnt > 1)
                    traitSetResult = traitSetResult.shallowCopy(); // copy on write
                traitSetResult.set.push(toMerge);
                traitSetResult.lookupByTrait.set(trait, toMerge);
                if (forAtt) {
                    let avMerge = toMerge.parameterValues.values;
                    let l = av.length;
                    for (let i = 0; i < l; i++) {
                        let strConst = avMerge[i];
                        if (strConst && strConst.constantValue && strConst.constantValue === "this.attribute" && strConst.resolvedReference !== forAtt) {
                            // never change the values in the trait passed in.
                            traitSetResult = traitSetResult.shallowCopyWithException(trait); // copy on write
                            let rtOld = traitSetResult.lookupByTrait.get(trait);
                            avMerge = rtOld.parameterValues.values;
                            avMerge[i] = forAtt;
                        }
                    }
                }
            }
            return traitSetResult;
        }
        //return p.measure(bodyCode);
    }
    mergeWillAlter(toMerge, forAtt = null) {
        //let bodyCode = () =>
        {
            let trait = toMerge.trait;
            if (!this.lookupByTrait.has(trait))
                return true;
            let pc = toMerge.parameterValues.pc;
            let av = toMerge.parameterValues.values;
            let rtOld = this.lookupByTrait.get(trait);
            let avOld = rtOld.parameterValues.values;
            let l = av.length;
            for (let i = 0; i < l; i++) {
                if (av[i] != avOld[i])
                    return true;
                if (forAtt) {
                    let strConst = av[i];
                    if (strConst.constantValue && strConst.constantValue === "this.attribute" && strConst.resolvedReference !== forAtt)
                        return true;
                }
            }
            return false;
        }
        //return p.measure(bodyCode);
    }
    mergeSet(toMerge, forAtt = null) {
        //let bodyCode = () =>
        {
            let traitSetResult = this;
            if (toMerge) {
                let l = toMerge.set.length;
                for (let i = 0; i < l; i++) {
                    const rt = toMerge.set[i];
                    let traitSetMerge = traitSetResult.merge(rt, this.refCnt > 1, forAtt);
                    if (traitSetMerge !== traitSetResult) {
                        traitSetResult = traitSetMerge;
                    }
                }
            }
            return traitSetResult;
        }
        //return p.measure(bodyCode);
    }
    mergeSetWillAlter(toMerge, forAtt = null) {
        //let bodyCode = () =>
        {
            let traitSetResult = this;
            if (toMerge) {
                let l = toMerge.set.length;
                for (let i = 0; i < l; i++) {
                    const rt = toMerge.set[i];
                    if (traitSetResult.mergeWillAlter(rt, forAtt))
                        return true;
                }
            }
            return false;
        }
        //return p.measure(bodyCode);
    }
    get(trait) {
        //let bodyCode = () =>
        {
            if (this.lookupByTrait.has(trait))
                return this.lookupByTrait.get(trait);
            return null;
        }
        //return p.measure(bodyCode);
    }
    find(traitName) {
        //let bodyCode = () =>
        {
            let l = this.set.length;
            for (let i = 0; i < l; i++) {
                const rt = this.set[i];
                if (rt.trait.isDerivedFrom(traitName))
                    return rt;
            }
            return null;
        }
        //return p.measure(bodyCode);
    }
    get size() {
        //let bodyCode = () =>
        {
            if (this.set)
                return this.set.length;
            return 0;
        }
        //return p.measure(bodyCode);
    }
    get first() {
        //let bodyCode = () =>
        {
            if (this.set)
                return this.set[0];
            return null;
        }
        //return p.measure(bodyCode);
    }
    shallowCopyWithException(just) {
        //let bodyCode = () =>
        {
            let copy = new ResolvedTraitSet();
            let newSet = copy.set;
            let l = this.set.length;
            for (let i = 0; i < l; i++) {
                let rt = this.set[i];
                if (rt.trait == just)
                    rt = rt.copy();
                newSet.push(rt);
                copy.lookupByTrait.set(rt.trait, rt);
            }
            return copy;
        }
        //return p.measure(bodyCode);
    }
    shallowCopy() {
        //let bodyCode = () =>
        {
            let copy = new ResolvedTraitSet();
            if (this.set) {
                let newSet = copy.set;
                let l = this.set.length;
                for (let i = 0; i < l; i++) {
                    let rt = this.set[i];
                    newSet.push(rt);
                    copy.lookupByTrait.set(rt.trait, rt);
                }
            }
            return copy;
        }
        //return p.measure(bodyCode);
    }
    collectTraitNames() {
        //let bodyCode = () =>
        {
            let collection = new Set();
            if (this.set) {
                let l = this.set.length;
                for (let i = 0; i < l; i++) {
                    let rt = this.set[i];
                    rt.collectTraitNames(collection);
                }
            }
            return collection;
        }
        //return p.measure(bodyCode);
    }
    keepElevated() {
        //let bodyCode = () =>
        {
            let elevatedSet;
            let elevatedLookup;
            let result;
            if (this.refCnt > 1) {
                result = new ResolvedTraitSet();
                elevatedSet = result.set;
                elevatedLookup = result.lookupByTrait;
            }
            else {
                result = this;
                elevatedSet = new Array();
                elevatedLookup = new Map();
            }
            let l = this.set.length;
            for (let i = 0; i < l; i++) {
                const rt = this.set[i];
                if (rt.trait.elevated) {
                    elevatedSet.push(rt);
                    elevatedLookup.set(rt.trait, rt);
                }
            }
            result.set = elevatedSet;
            result.lookupByTrait = elevatedLookup;
            return result;
        }
        //return p.measure(bodyCode);
    }
    setTraitParameterValue(toTrait, paramName, value) {
        //let bodyCode = () =>
        {
            let altered = this;
            //if (altered.refCnt > 1) {
            altered = this.shallowCopyWithException(toTrait);
            //}
            altered.get(toTrait).parameterValues.setParameterValue(paramName, value);
            return altered;
        }
        //return p.measure(bodyCode);
    }
    spew(indent) {
        //let bodyCode = () =>
        {
            let l = this.set.length;
            for (let i = 0; i < l; i++) {
                this.set[i].spew(indent);
            }
            ;
        }
        //return p.measure(bodyCode);
    }
}
exports.ResolvedTraitSet = ResolvedTraitSet;
class ResolvedTraitSetBuilder {
    constructor(set) {
        //let bodyCode = () =>
        {
            this.set = set;
        }
        //return p.measure(bodyCode);
    }
    clear() {
        //let bodyCode = () =>
        {
            if (this.rts) {
                this.rts.release();
                this.rts = null;
            }
        }
        //return p.measure(bodyCode);
    }
    mergeTraits(rtsNew, forAtt = null) {
        //let bodyCode = () =>
        {
            if (rtsNew) {
                if (!this.rts) {
                    if (forAtt) {
                        // need to run the mergeset code, even though nothing to merge. it sets the att
                        this.takeReference(new ResolvedTraitSet());
                        this.takeReference(this.rts.mergeSet(rtsNew, forAtt));
                    }
                    else
                        this.takeReference(rtsNew);
                }
                else
                    this.takeReference(this.rts.mergeSet(rtsNew, forAtt));
            }
        }
        //return p.measure(bodyCode);
    }
    takeReference(rtsNew) {
        //let bodyCode = () =>
        {
            if (this.rts !== rtsNew) {
                if (rtsNew)
                    rtsNew.addRef();
                if (this.rts)
                    this.rts.release();
                this.rts = rtsNew;
            }
        }
        //return p.measure(bodyCode);
    }
    ownOne(rt) {
        //let bodyCode = () =>
        {
            this.takeReference(new ResolvedTraitSet());
            this.rts.merge(rt, false);
        }
        //return p.measure(bodyCode);
    }
    setParameterValueFromArgument(trait, arg) {
        //let bodyCode = () =>
        {
            if (this.rts) {
                let resTrait = this.rts.get(trait);
                if (resTrait) {
                    let av = resTrait.parameterValues.values;
                    let newVal = arg.getValue();
                    // get the value index from the parameter collection given the parameter that this argument is setting
                    let iParam = resTrait.parameterValues.indexOf(arg.getParameterDef());
                    if (this.rts.refCnt > 1 && av[iParam] != newVal) {
                        // make a copy and try again
                        this.takeReference(this.rts.shallowCopyWithException(trait));
                        resTrait = this.rts.get(trait);
                        av = resTrait.parameterValues.values;
                    }
                    av[iParam] = ParameterValue.getReplacementValue(av[iParam], newVal);
                }
            }
        }
        //return p.measure(bodyCode);
    }
    setTraitParameterValue(toTrait, paramName, value) {
        //let bodyCode = () =>
        {
            this.takeReference(this.rts.setTraitParameterValue(toTrait, paramName, value));
        }
        //return p.measure(bodyCode);
    }
    cleanUp() {
        //let bodyCode = () =>
        {
            if (this.rts && this.set == cdmTraitSet.elevatedOnly) {
                this.takeReference(this.rts.keepElevated());
            }
        }
        //return p.measure(bodyCode);
    }
}
////////////////////////////////////////////////////////////////////////////////////////////////////
//  resolved attributes
////////////////////////////////////////////////////////////////////////////////////////////////////
let __raCopy = 0;
class ResolvedAttribute {
    constructor(attribute) {
        //let bodyCode = () =>
        {
            this.attribute = attribute;
            this.resolvedTraits = new ResolvedTraitSet();
            this.resolvedTraits.addRef();
            this.resolvedName = attribute.getName();
        }
        //return p.measure(bodyCode);
    }
    copy() {
        //let bodyCode = () =>
        {
            let copy = new ResolvedAttribute(this.attribute);
            copy.resolvedName = this.resolvedName;
            copy.resolvedTraits = this.resolvedTraits.shallowCopy();
            copy.resolvedTraits.addRef();
            copy.insertOrder = this.insertOrder;
            return copy;
        }
        //return p.measure(bodyCode);
    }
    spew(indent) {
        //let bodyCode = () =>
        {
            console.log(`${indent}[${this.resolvedName}]`);
            this.resolvedTraits.spew(indent + '-');
        }
        //return p.measure(bodyCode);
    }
}
exports.ResolvedAttribute = ResolvedAttribute;
class ResolvedAttributeSet extends refCounted {
    constructor() {
        super();
        //let bodyCode = () =>
        {
            this.resolvedName2resolvedAttribute = new Map();
            this.set = new Array();
        }
        //return p.measure(bodyCode);
    }
    merge(toMerge) {
        //let bodyCode = () =>
        {
            let rasResult = this;
            if (toMerge) {
                if (rasResult.resolvedName2resolvedAttribute.has(toMerge.resolvedName)) {
                    let existing = rasResult.resolvedName2resolvedAttribute.get(toMerge.resolvedName);
                    if (this.refCnt > 1 && existing.attribute !== toMerge.attribute) {
                        rasResult = rasResult.copy(); // copy on write
                        existing = rasResult.resolvedName2resolvedAttribute.get(toMerge.resolvedName);
                    }
                    existing.attribute = toMerge.attribute; // replace with newest version
                    let rtsMerge = existing.resolvedTraits.mergeSet(toMerge.resolvedTraits); // newest one may replace
                    if (rtsMerge !== existing.resolvedTraits) {
                        rasResult = rasResult.copy(); // copy on write
                        existing = rasResult.resolvedName2resolvedAttribute.get(toMerge.resolvedName);
                        existing.resolvedTraits.release();
                        existing.resolvedTraits = rtsMerge;
                        existing.resolvedTraits.addRef();
                    }
                }
                else {
                    if (this.refCnt > 1)
                        rasResult = rasResult.copy(); // copy on write
                    rasResult.resolvedName2resolvedAttribute.set(toMerge.resolvedName, toMerge);
                    toMerge.insertOrder = rasResult.set.length;
                    rasResult.set.push(toMerge);
                }
                this.baseTrait2Attributes = null;
            }
            return rasResult;
        }
        //return p.measure(bodyCode);
    }
    mergeSet(toMerge) {
        //let bodyCode = () =>
        {
            let rasResult = this;
            if (toMerge) {
                let l = toMerge.set.length;
                for (let i = 0; i < l; i++) {
                    let rasMerged = rasResult.merge(toMerge.set[i]);
                    if (rasMerged !== rasResult) {
                        rasResult = rasMerged;
                    }
                }
            }
            return rasResult;
        }
        //return p.measure(bodyCode);
    }
    mergeTraitAttributes(traits, continuationsIn) {
        //let bodyCode = () =>
        {
            // if there was no continuation set provided, build one 
            if (!continuationsIn) {
                continuationsIn = new ApplierContinuationSet();
                // collect a set of appliers for all traits
                let appliers = new Array();
                let iApplier = 0;
                if (traits) {
                    let l = traits.size;
                    for (let i = 0; i < l; i++) {
                        const rt = traits.set[i];
                        if (rt.trait.modifiesAttributes) {
                            let traitAppliers = rt.trait.getTraitAppliers();
                            if (traitAppliers) {
                                let l = traitAppliers.length;
                                for (let ita = 0; ita < l; ita++) {
                                    const apl = traitAppliers[ita];
                                    if (apl.attributeAdd)
                                        appliers.push([rt, apl]);
                                }
                            }
                        }
                    }
                }
                if (appliers.length == 0)
                    return null;
                for (const resTraitApplier of appliers) {
                    let applier = resTraitApplier["1"];
                    let rt = resTraitApplier["0"];
                    // if there are no attributes, this is an entity attribute 
                    if (this.resolvedName2resolvedAttribute.size == 0) {
                        continuationsIn.continuations.push({ applier: applier, resAtt: null, resTrait: rt, continuationState: null });
                    }
                    else {
                        // one for each attribute and applier combo
                        let l = this.set.length;
                        for (let i = 0; i < l; i++) {
                            continuationsIn.continuations.push({ applier: applier, resAtt: this.set[i], resTrait: rt, continuationState: null });
                        }
                    }
                }
            }
            // for every attribute in the set run any attribute adders and collect results in a new set
            let addedAttSet = new ResolvedAttributeSet();
            addedAttSet.addRef();
            let continuationsOut = new ApplierContinuationSet();
            for (const continueWith of continuationsIn.continuations) {
                if (continueWith.applier.willAdd(continueWith.resAtt, continueWith.resTrait, continueWith.continuationState)) {
                    let result = continueWith.applier.attributeAdd(continueWith.resAtt, continueWith.resTrait, continueWith.continuationState);
                    // create a new resolved attribute and apply the traits that it has
                    let newAttSet = new ResolvedAttributeSet();
                    newAttSet.addRef();
                    let mergeOne = newAttSet.merge(new ResolvedAttribute(result.addedAttribute).copy());
                    mergeOne.addRef();
                    newAttSet.release();
                    newAttSet = mergeOne;
                    newAttSet.applyTraits(result.addedAttribute.getResolvedTraits());
                    // accumulate all added
                    let mergeResult = addedAttSet.mergeSet(newAttSet);
                    mergeResult.addRef();
                    addedAttSet.release();
                    addedAttSet = mergeResult;
                    // if a continue requested, add to list
                    if (result.continuationState)
                        continuationsOut.continuations.push({ applier: continueWith.applier, resAtt: continueWith.resAtt, resTrait: continueWith.resTrait, continuationState: result.continuationState });
                }
            }
            continuationsOut.rasResult = this.mergeSet(addedAttSet);
            continuationsOut.rasResult.addRef();
            if (!continuationsOut.continuations.length)
                continuationsOut.continuations = null;
            return continuationsOut;
        }
        //return p.measure(bodyCode);
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    //  traits that change attributes
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    applyTraits(traits) {
        //let bodyCode = () =>
        {
            // collect a set of appliers for all traits
            let appliers = new Array();
            let iApplier = 0;
            if (traits) {
                let l = traits.size;
                for (let i = 0; i < l; i++) {
                    const rt = traits.set[i];
                    if (rt.trait.modifiesAttributes) {
                        let traitAppliers = rt.trait.getTraitAppliers();
                        if (traitAppliers) {
                            let l = traitAppliers.length;
                            for (let ita = 0; ita < l; ita++) {
                                const apl = traitAppliers[ita];
                                if (apl.attributeApply)
                                    appliers.push([rt, apl]);
                            }
                        }
                    }
                }
            }
            // sorted by priority
            appliers = appliers.sort((l, r) => r["1"].priority - l["1"].priority);
            let rasResult = this;
            let rasApplied;
            if (this.refCnt > 1 && rasResult.copyNeeded(traits, appliers)) {
                rasResult = rasResult.copy();
            }
            rasApplied = rasResult.apply(traits, appliers);
            // now we are that
            rasResult.resolvedName2resolvedAttribute = rasApplied.resolvedName2resolvedAttribute;
            rasResult.baseTrait2Attributes = null;
            rasResult.set = rasApplied.set;
            return rasResult;
        }
        //return p.measure(bodyCode);
    }
    copyNeeded(traits, appliers) {
        //let bodyCode = () =>
        {
            // for every attribute in the set, detect if a merge of traits will alter the traits. if so, need to copy the attribute set to avoid overwrite 
            let l = this.set.length;
            for (let i = 0; i < l; i++) {
                const resAtt = this.set[i];
                if (resAtt.resolvedTraits.mergeSetWillAlter(traits, resAtt.attribute))
                    return true;
                for (const resTraitApplier of appliers) {
                    let applier = resTraitApplier["1"];
                    let rt = resTraitApplier["0"];
                    if (applier.willApply(resAtt, rt))
                        return true;
                }
            }
            return false;
        }
        //return p.measure(bodyCode);
    }
    apply(traits, appliers) {
        //let bodyCode = () =>
        {
            // for every attribute in the set run any attribute appliers
            let appliedAttSet = new ResolvedAttributeSet();
            let l = this.set.length;
            for (let i = 0; i < l; i++) {
                const resAtt = this.set[i];
                let rtsMerge = resAtt.resolvedTraits.mergeSet(traits, resAtt.attribute);
                resAtt.resolvedTraits.release();
                resAtt.resolvedTraits = rtsMerge;
                resAtt.resolvedTraits.addRef();
                for (const resTraitApplier of appliers) {
                    let applier = resTraitApplier["1"];
                    let rt = resTraitApplier["0"];
                    if (applier.willApply(resAtt, rt)) {
                        applier.attributeApply(resAtt, rt);
                    }
                }
                appliedAttSet.merge(resAtt);
            }
            return appliedAttSet;
        }
        //return p.measure(bodyCode);
    }
    removeRequestedAtts() {
        //let bodyCode = () =>
        {
            // for every attribute in the set run any attribute removers on the traits they have
            let appliedAttSet = new ResolvedAttributeSet();
            let l = this.set.length;
            for (let i = 0; i < l; i++) {
                let resAtt = this.set[i];
                if (resAtt.resolvedTraits) {
                    let l = resAtt.resolvedTraits.size;
                    for (let i = 0; resAtt && i < l; i++) {
                        const rt = resAtt.resolvedTraits.set[i];
                        if (resAtt && rt.trait.modifiesAttributes) {
                            let traitAppliers = rt.trait.getTraitAppliers();
                            if (traitAppliers) {
                                let l = traitAppliers.length;
                                for (let ita = 0; ita < l; ita++) {
                                    const apl = traitAppliers[ita];
                                    if (resAtt && apl.attributeRemove) {
                                        let result = apl.attributeRemove(resAtt, rt);
                                        if (result.shouldDelete) {
                                            resAtt = null;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                if (resAtt)
                    appliedAttSet.merge(resAtt);
            }
            // now we are that (or a copy)
            let rasResult = this;
            if (this.refCnt > 1 && appliedAttSet.size != rasResult.size) {
                rasResult = appliedAttSet;
            }
            rasResult.resolvedName2resolvedAttribute = appliedAttSet.resolvedName2resolvedAttribute;
            rasResult.baseTrait2Attributes = null;
            rasResult.set = appliedAttSet.set;
            return rasResult;
        }
        //return p.measure(bodyCode);
    }
    getAttributesWithTraits(queryFor) {
        //let bodyCode = () =>
        {
            // put the input into a standard form
            let query = new Array();
            if (queryFor instanceof Array) {
                let l = queryFor.length;
                for (let i = 0; i < l; i++) {
                    let q = queryFor[i];
                    if (typeof (q) === "string")
                        query.push({ traitBaseName: q, params: [] });
                    else
                        query.push(q);
                }
            }
            else {
                if (typeof (queryFor) === "string")
                    query.push({ traitBaseName: queryFor, params: [] });
                else
                    query.push(queryFor);
            }
            // if the map isn't in place, make one now. assumption is that this is called as part of a usage pattern where it will get called again.
            if (!this.baseTrait2Attributes) {
                this.baseTrait2Attributes = new Map();
                let l = this.set.length;
                for (let i = 0; i < l; i++) {
                    // create a map from the name of every trait found in this whole set of attributes to the attributes that have the trait (included base classes of traits)
                    const resAtt = this.set[i];
                    let traitNames = resAtt.resolvedTraits.collectTraitNames();
                    traitNames.forEach(tName => {
                        if (!this.baseTrait2Attributes.has(tName))
                            this.baseTrait2Attributes.set(tName, new Set());
                        this.baseTrait2Attributes.get(tName).add(resAtt);
                    });
                }
            }
            // for every trait in the query, get the set of attributes.
            // intersect these sets to get the final answer
            let finalSet;
            let lQuery = query.length;
            for (let i = 0; i < lQuery; i++) {
                const q = query[i];
                if (this.baseTrait2Attributes.has(q.traitBaseName)) {
                    let subSet = this.baseTrait2Attributes.get(q.traitBaseName);
                    if (q.params && q.params.length) {
                        // need to check param values, so copy the subset to something we can modify 
                        let filteredSubSet = new Set();
                        subSet.forEach(ra => {
                            // get parameters of the the actual trait matched
                            let pvals = ra.resolvedTraits.find(q.traitBaseName).parameterValues;
                            // compare to all query params
                            let lParams = q.params.length;
                            let iParam;
                            for (iParam = 0; iParam < lParams; iParam++) {
                                const param = q.params[i];
                                let pv = pvals.getParameterValue(param.paramName);
                                if (!pv || pv.valueString != param.paramValue)
                                    break;
                            }
                            // stop early means no match
                            if (iParam == lParams)
                                filteredSubSet.add(ra);
                        });
                        subSet = filteredSubSet;
                    }
                    if (subSet && subSet.size) {
                        // got some. either use as starting point for answer or intersect this in
                        if (!finalSet)
                            finalSet = subSet;
                        else {
                            let intersection = new Set();
                            // intersect the two
                            finalSet.forEach(ra => {
                                if (subSet.has(ra))
                                    intersection.add(ra);
                            });
                            finalSet = intersection;
                        }
                    }
                }
            }
            // collect the final set into a resolvedAttributeSet
            if (finalSet && finalSet.size) {
                let rasResult = new ResolvedAttributeSet();
                finalSet.forEach(ra => {
                    rasResult.merge(ra);
                });
                return rasResult;
            }
            return null;
        }
        //return p.measure(bodyCode);
    }
    get(name) {
        //let bodyCode = () =>
        {
            if (this.resolvedName2resolvedAttribute.has(name)) {
                return this.resolvedName2resolvedAttribute.get(name);
            }
            return null;
        }
        //return p.measure(bodyCode);
    }
    get size() {
        return this.resolvedName2resolvedAttribute.size;
    }
    copy() {
        //let bodyCode = () =>
        {
            let copy = new ResolvedAttributeSet();
            let l = this.set.length;
            for (let i = 0; i < l; i++) {
                copy.merge(this.set[i].copy());
            }
            return copy;
        }
        //return p.measure(bodyCode);
    }
    spew(indent) {
        //let bodyCode = () =>
        {
            let l = this.set.length;
            for (let i = 0; i < l; i++) {
                this.set[i].spew(indent);
            }
        }
        //return p.measure(bodyCode);
    }
}
exports.ResolvedAttributeSet = ResolvedAttributeSet;
class ResolvedAttributeSetBuilder {
    mergeAttributes(rasNew) {
        //let bodyCode = () =>
        {
            if (rasNew) {
                if (!this.ras)
                    this.takeReference(rasNew);
                else
                    this.takeReference(this.ras.mergeSet(rasNew));
            }
        }
        //return p.measure(bodyCode);
    }
    takeReference(rasNew) {
        //let bodyCode = () =>
        {
            if (this.ras !== rasNew) {
                if (rasNew)
                    rasNew.addRef();
                if (this.ras)
                    this.ras.release();
                this.ras = rasNew;
            }
        }
        //return p.measure(bodyCode);
    }
    ownOne(ra) {
        //let bodyCode = () =>
        {
            this.takeReference(new ResolvedAttributeSet());
            this.ras.merge(ra);
        }
        //return p.measure(bodyCode);
    }
    applyTraits(rts) {
        //let bodyCode = () =>
        {
            if (this.ras)
                this.takeReference(this.ras.applyTraits(rts));
        }
        //return p.measure(bodyCode);
    }
    mergeTraitAttributes(rts) {
        //let bodyCode = () =>
        {
            if (!this.ras)
                this.takeReference(new ResolvedAttributeSet());
            let localContinue = null;
            while (localContinue = this.ras.mergeTraitAttributes(rts, localContinue)) {
                this.takeReference(localContinue.rasResult);
                if (!localContinue.continuations)
                    break;
            }
        }
        //return p.measure(bodyCode);
    }
    removeRequestedAtts() {
        //let bodyCode = () =>
        {
            if (this.ras) {
                this.takeReference(this.ras.removeRequestedAtts());
            }
        }
        //return p.measure(bodyCode);
    }
    markInherited() {
        //let bodyCode = () =>
        {
            if (this.ras && this.ras.set)
                this.inheritedMark = this.ras.set.length;
            else
                this.inheritedMark = 0;
        }
        //return p.measure(bodyCode);
    }
}
////////////////////////////////////////////////////////////////////////////////////////////////////
//  attributed references to other entities
////////////////////////////////////////////////////////////////////////////////////////////////////
class attributePromise {
    constructor(forAtt) {
        //let bodyCode = () =>
        {
            this.requestedName = forAtt;
        }
        //return p.measure(bodyCode);
    }
}
class ResolvedEntityReferenceSide {
    constructor(entity, rasb) {
        //let bodyCode = () =>
        {
            if (entity)
                this.entity = entity;
            if (rasb)
                this.rasb = rasb;
            else
                this.rasb = new ResolvedAttributeSetBuilder();
        }
        //return p.measure(bodyCode);
    }
    getFirstAttribute() {
        //let bodyCode = () =>
        {
            if (this.rasb && this.rasb.ras && this.rasb.ras.set && this.rasb.ras.set.length)
                return this.rasb.ras.set[0];
        }
        //return p.measure(bodyCode);
    }
    spew(indent) {
        //let bodyCode = () =>
        {
            console.log(`${indent} ent=${this.entity.getName()}`);
            this.rasb.ras.spew(indent + '  atts:');
        }
        //return p.measure(bodyCode);
    }
}
exports.ResolvedEntityReferenceSide = ResolvedEntityReferenceSide;
class ResolvedEntityReference {
    constructor() {
        //let bodyCode = () =>
        {
            this.referencing = new ResolvedEntityReferenceSide();
            this.referenced = new Array();
        }
        //return p.measure(bodyCode);
    }
    copy() {
        //let bodyCode = () =>
        {
            let result = new ResolvedEntityReference();
            result.referencing.entity = this.referencing.entity;
            result.referencing.rasb = this.referencing.rasb;
            this.referenced.forEach(rers => {
                result.referenced.push(new ResolvedEntityReferenceSide(rers.entity, rers.rasb));
            });
            return result;
        }
        //return p.measure(bodyCode);
    }
    spew(indent) {
        //let bodyCode = () =>
        {
            this.referencing.spew(indent + "(referencing)");
            for (let i = 0; i < this.referenced.length; i++) {
                this.referenced[i].spew(indent + `(referenced[${i}])`);
            }
        }
        //return p.measure(bodyCode);
    }
}
exports.ResolvedEntityReference = ResolvedEntityReference;
class ResolvedEntityReferenceSet {
    constructor(set = undefined) {
        //let bodyCode = () =>
        {
            if (set) {
                this.set = set;
            }
            else
                this.set = new Array();
        }
        //return p.measure(bodyCode);
    }
    add(toAdd) {
        //let bodyCode = () =>
        {
            if (toAdd && toAdd.set && toAdd.set.length) {
                this.set = this.set.concat(toAdd.set);
            }
        }
        //return p.measure(bodyCode);
    }
    copy() {
        //let bodyCode = () =>
        {
            let newSet = this.set.slice(0);
            for (let i = 0; i < newSet.length; i++) {
                newSet[i] = newSet[i].copy();
            }
            return new ResolvedEntityReferenceSet(newSet);
        }
        //return p.measure(bodyCode);
    }
    findEntity(entOther) {
        //let bodyCode = () =>
        {
            // make an array of just the refs that include the requested
            let filter = this.set.filter((rer) => {
                return (rer.referenced.some((rers) => {
                    if (rers.entity === entOther)
                        return true;
                }));
            });
            if (filter.length == 0)
                return null;
            return new ResolvedEntityReferenceSet(filter);
        }
        //return p.measure(bodyCode);
    }
    spew(indent) {
        //let bodyCode = () =>
        {
            for (let i = 0; i < this.set.length; i++) {
                this.set[i].spew(indent + `(rer[${i}])`);
            }
        }
        //return p.measure(bodyCode);
    }
}
exports.ResolvedEntityReferenceSet = ResolvedEntityReferenceSet;
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
//
//  friendly format 
//
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
class friendlyFormatNode {
    constructor(leafSource) {
        this.verticalMode = false;
        this.indentChildren = true;
        this.terminateAfterList = true;
        this.lineWrap = false;
        this.forceWrap = false;
        this.bracketEmpty = false;
        this.layoutWidth = 0;
        this.leafSource = leafSource;
    }
    addComment(comment) {
        this.comment = comment;
    }
    addChild(child) {
        if (!this.children)
            this.children = new Array();
        this.children.push(child);
    }
    addChildString(source, quotes = false) {
        if (source) {
            if (quotes)
                source = `"${source}"`;
            this.addChild(new friendlyFormatNode(source));
        }
    }
    setDelimiters() {
        this.calcStarter = "";
        this.calcTerminator = "";
        this.calcPreceedingSeparator = "";
        if (!this.children && !this.leafSource) {
            if (this.bracketEmpty && this.starter && this.terminator) {
                this.calcStarter = this.starter;
                this.calcTerminator = this.terminator;
            }
            return;
        }
        if (this.starter)
            this.calcStarter = this.starter;
        if (this.terminator)
            this.calcTerminator = this.terminator;
        let lChildren = this.children ? this.children.length : 0;
        for (let iChild = 0; iChild < lChildren; iChild++) {
            let child = this.children[iChild];
            child.setDelimiters();
            if (iChild > 0 && this.separator)
                child.calcPreceedingSeparator = this.separator;
        }
    }
    setWhitespace(indentLevel, needsNL) {
        this.calcIndentLevel = indentLevel;
        let lChildren = this.children ? this.children.length : 0;
        let didNL = false;
        if (this.leafSource) {
            this.calcNLBefore = needsNL;
        }
        for (let iChild = 0; iChild < lChildren; iChild++) {
            let child = this.children[iChild];
            if (this.verticalMode)
                needsNL = !didNL;
            didNL = child.setWhitespace(indentLevel + ((this.indentChildren && this.verticalMode) ? 1 : 0), needsNL);
            if (!this.verticalMode)
                needsNL = false;
        }
        if (this.verticalMode) {
            if (needsNL) {
                this.calcNLAfter = true;
                didNL = true;
            }
        }
        return didNL;
    }
    layout(maxWidth, maxMargin, start, indentWidth) {
        let position = start;
        let firstWrite;
        if (this.calcPreceedingSeparator) {
            firstWrite = position;
            position += this.calcPreceedingSeparator.length;
        }
        if (this.calcStarter) {
            firstWrite = firstWrite != undefined ? firstWrite : position;
            position += this.calcStarter.length;
        }
        if (this.calcNLBefore) {
            position = 0;
            position += this.calcIndentLevel * indentWidth;
            firstWrite = position;
        }
        if (this.children) {
            let lChildren = this.children.length;
            let wrapTo;
            for (let iChild = 0; iChild < lChildren; iChild++) {
                let child = this.children[iChild];
                if (iChild > 0 && (this.forceWrap || (this.lineWrap && position + child.layoutWidth > maxWidth))) {
                    child.calcNLBefore = true;
                    child.calcIndentLevel = Math.floor((wrapTo + indentWidth) / indentWidth);
                    position = child.calcIndentLevel * indentWidth;
                }
                let childLayout = child.layout(maxWidth, maxMargin, position, indentWidth);
                position = childLayout["0"];
                if (iChild == 0) {
                    wrapTo = childLayout["1"];
                    firstWrite = firstWrite != undefined ? firstWrite : wrapTo;
                }
            }
        }
        else if (this.leafSource) {
            firstWrite = firstWrite != undefined ? firstWrite : position;
            position += this.leafSource.length;
        }
        if (this.calcNLAfter) {
            position = 0;
            firstWrite = firstWrite != undefined ? firstWrite : position;
        }
        if (this.calcTerminator) {
            if (this.calcNLAfter)
                position += this.calcIndentLevel * indentWidth;
            firstWrite = firstWrite != undefined ? firstWrite : position;
            position += this.calcTerminator.length;
            if (this.calcNLAfter)
                position = 0;
        }
        firstWrite = firstWrite != undefined ? firstWrite : position;
        this.layoutWidth = position - firstWrite;
        return [position, firstWrite];
    }
    lineStart(startIndent) {
        let line = "";
        while (startIndent) {
            line += " ";
            startIndent--;
        }
        return line;
    }
    compose(indentWidth) {
        let compose = "";
        compose += this.calcPreceedingSeparator;
        if (this.calcStarter) {
            compose += this.calcStarter;
        }
        if (this.calcNLBefore) {
            compose += "\n";
            compose += this.lineStart(this.calcIndentLevel * indentWidth);
        }
        if (this.children) {
            let lChildren = this.children.length;
            for (let iChild = 0; iChild < lChildren; iChild++) {
                let child = this.children[iChild];
                compose += child.compose(indentWidth);
            }
        }
        else if (this.leafSource) {
            compose += this.leafSource;
        }
        if (this.calcNLAfter) {
            compose += "\n";
        }
        if (this.calcTerminator) {
            if (this.calcNLAfter)
                compose += this.lineStart(this.calcIndentLevel * indentWidth);
            compose += this.calcTerminator;
            if (this.calcNLAfter)
                compose += "\n";
        }
        return compose;
    }
    toString(maxWidth, maxMargin, startIndent, indentWidth) {
        this.setDelimiters();
        this.setWhitespace(0, false);
        this.calcNLBefore = false;
        // layout with a giant maxWidth so that we just measure everything
        this.layout(Number.MAX_SAFE_INTEGER, maxMargin, startIndent, indentWidth);
        // now use the real max
        this.layout(maxWidth, maxMargin, startIndent, indentWidth);
        return this.compose(indentWidth);
    }
}
exports.friendlyFormatNode = friendlyFormatNode;
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
//
//  common base class
//  {Object}
//
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
class cdmObject {
    constructor() {
        this.skipElevated = true;
        this.resolvingAttributes = false;
    }
    getResolvedTraits(set) {
        //let bodyCode = () =>
        {
            if (!set)
                set = cdmTraitSet.all;
            if (!this.rtsbInherited && (set == cdmTraitSet.all || set == cdmTraitSet.inheritedOnly)) {
                this.rtsbInherited = new ResolvedTraitSetBuilder(cdmTraitSet.inheritedOnly);
                this.constructResolvedTraits(this.rtsbInherited);
            }
            if (!this.rtsbApplied && (set == cdmTraitSet.all || set == cdmTraitSet.appliedOnly)) {
                this.rtsbApplied = new ResolvedTraitSetBuilder(cdmTraitSet.appliedOnly);
                this.constructResolvedTraits(this.rtsbApplied);
            }
            if (!this.skipElevated && !this.rtsbElevated && (set == cdmTraitSet.all || set == cdmTraitSet.elevatedOnly)) {
                this.rtsbElevated = new ResolvedTraitSetBuilder(cdmTraitSet.elevatedOnly);
                this.constructResolvedTraits(this.rtsbElevated);
            }
            if (!this.rtsbAll && set == cdmTraitSet.all) {
                this.rtsbAll = new ResolvedTraitSetBuilder(cdmTraitSet.all);
                // applied go after inherited so they can override
                this.rtsbAll.takeReference(this.rtsbInherited.rts);
                if (!this.skipElevated)
                    this.rtsbAll.mergeTraits(this.rtsbElevated.rts);
                this.rtsbAll.mergeTraits(this.rtsbApplied.rts);
            }
            if (set == cdmTraitSet.all)
                return this.rtsbAll.rts;
            if (set == cdmTraitSet.inheritedOnly)
                return this.rtsbInherited.rts;
            if (set == cdmTraitSet.appliedOnly)
                return this.rtsbApplied.rts;
            if (set == cdmTraitSet.elevatedOnly && !this.skipElevated)
                return this.rtsbElevated.rts;
        }
        //return p.measure(bodyCode);
    }
    setTraitParameterValue(toTrait, paramName, value) {
        //let bodyCode = () =>
        {
            // causes rtsb to get created
            this.getResolvedTraits();
            this.rtsbAll.setTraitParameterValue(toTrait, paramName, value);
        }
        //return p.measure(bodyCode);
    }
    getResolvedAttributes() {
        //let bodyCode = () =>
        {
            if (!this.resolvedAttributeSetBuilder) {
                if (this.resolvingAttributes) {
                    // re-entered this attribute through some kind of self or looping reference.
                    return new ResolvedAttributeSet();
                }
                this.resolvingAttributes = true;
                this.resolvedAttributeSetBuilder = this.constructResolvedAttributes();
                this.resolvingAttributes = false;
            }
            return this.resolvedAttributeSetBuilder.ras;
        }
        //return p.measure(bodyCode);
    }
    clearTraitCache() {
        //let bodyCode = () =>
        {
            if (this.rtsbAll)
                this.rtsbAll.clear();
            if (this.rtsbApplied)
                this.rtsbApplied.clear();
            if (this.rtsbElevated)
                this.rtsbElevated.clear();
            if (this.rtsbInherited)
                this.rtsbInherited.clear();
        }
        //return p.measure(bodyCode);
    }
    toJSON(stringRefs) {
        //let bodyCode = () =>
        {
            return this.copyData(stringRefs);
        }
        //return p.measure(bodyCode);
    }
    static arraycopyData(source, stringRefs) {
        //let bodyCode = () =>
        {
            if (!source)
                return undefined;
            let casted = new Array();
            let l = source.length;
            for (let i = 0; i < l; i++) {
                const element = source[i];
                casted.push(element ? element.copyData(stringRefs) : undefined);
            }
            return casted;
        }
        //return p.measure(bodyCode);
    }
    static arrayCopy(source) {
        //let bodyCode = () =>
        {
            if (!source)
                return undefined;
            let casted = new Array();
            let l = source.length;
            for (let i = 0; i < l; i++) {
                const element = source[i];
                casted.push(element ? element.copy() : undefined);
            }
            return casted;
        }
        //return p.measure(bodyCode);
    }
    static arrayGetFriendlyFormat(under, source) {
        //let bodyCode = () =>
        {
            if (!source || source.length == 0) {
                under.lineWrap = false;
                under.forceWrap = false;
                return;
            }
            let l = source.length;
            for (let i = 0; i < l; i++) {
                under.addChild(source[i].getFriendlyFormat());
            }
            if (l == 1) {
                under.lineWrap = false;
                under.forceWrap = false;
            }
        }
        //return p.measure(bodyCode);
    }
    static createStringOrImpl(object, typeName, creater) {
        //let bodyCode = () =>
        {
            if (!object)
                return undefined;
            if (typeof object === "string")
                return new StringConstant(typeName, object);
            else
                return creater(object);
        }
        //return p.measure(bodyCode);
    }
    static createConstant(object) {
        //let bodyCode = () =>
        {
            if (!object)
                return undefined;
            if (typeof object === "string")
                return new StringConstant(cdmObjectType.unresolved, object);
            else if (object.relationship) {
                if (object.dataType)
                    return TypeAttributeImpl.createClass(object);
                else if (object.entity)
                    return EntityAttributeImpl.createClass(object);
                else
                    return null;
            }
            else if (object.relationshipReference)
                return RelationshipReferenceImpl.createClass(object);
            else if (object.traitReference)
                return TraitReferenceImpl.createClass(object);
            else if (object.dataTypeReference)
                return DataTypeReferenceImpl.createClass(object);
            else if (object.entityReference)
                return EntityReferenceImpl.createClass(object);
            else if (object.attributeGroupReference)
                return AttributeGroupReferenceImpl.createClass(object);
            else
                return null;
        }
        //return p.measure(bodyCode);
    }
    static createDataTypeReference(object) {
        //let bodyCode = () =>
        {
            return cdmObject.createStringOrImpl(object, cdmObjectType.dataTypeRef, DataTypeReferenceImpl.createClass);
        }
        //return p.measure(bodyCode);
    }
    static createRelationshipReference(object) {
        //let bodyCode = () =>
        {
            return cdmObject.createStringOrImpl(object, cdmObjectType.relationshipRef, RelationshipReferenceImpl.createClass);
        }
        //return p.measure(bodyCode);
    }
    static createEntityReference(object) {
        //let bodyCode = () =>
        {
            return cdmObject.createStringOrImpl(object, cdmObjectType.entityRef, EntityReferenceImpl.createClass);
        }
        //return p.measure(bodyCode);
    }
    static createAttributeArray(object) {
        //let bodyCode = () =>
        {
            if (!object)
                return undefined;
            let result;
            result = new Array();
            let l = object.length;
            for (let i = 0; i < l; i++) {
                const ea = object[i];
                if (typeof ea === "string")
                    result.push(new StringConstant(cdmObjectType.attributeGroupRef, ea));
                else {
                    if (ea.attributeGroupReference)
                        result.push(AttributeGroupReferenceImpl.createClass(ea));
                    else if (ea.name)
                        result.push(TypeAttributeImpl.createClass(ea));
                    else if (ea.entity)
                        result.push(EntityAttributeImpl.createClass(ea));
                }
            }
            return result;
        }
        //return p.measure(bodyCode);
    }
    static createTraitReferenceArray(object) {
        //let bodyCode = () =>
        {
            if (!object)
                return undefined;
            let result;
            result = new Array();
            let l = object.length;
            for (let i = 0; i < l; i++) {
                const tr = object[i];
                result.push(cdmObject.createStringOrImpl(tr, cdmObjectType.traitRef, TraitReferenceImpl.createClass));
            }
            return result;
        }
        //return p.measure(bodyCode);
    }
    static visitArray(items, userData, pathRoot, preChildren, postChildren, statusRpt) {
        //let bodyCode = () =>
        {
            let result = false;
            if (items) {
                let lItem = items.length;
                for (let iItem = 0; iItem < lItem; iItem++) {
                    let element = items[iItem];
                    if (element) {
                        if (element.visit(userData, pathRoot, preChildren, postChildren, statusRpt)) {
                            result = true;
                            break;
                        }
                    }
                }
            }
            return result;
        }
        //return p.measure(bodyCode);
    }
}
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
//
//  string used as a constant, reference, or other shortcut
//
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
class StringConstant extends cdmObject {
    constructor(expectedType, constantValue) {
        super();
        //let bodyCode = () =>
        {
            this.expectedType = expectedType;
            this.constantValue = constantValue;
            this.objectType = cdmObjectType.stringConstant;
        }
        //return p.measure(bodyCode);
    }
    copyData(stringRefs) {
        //let bodyCode = () =>
        {
            this.checkForSwap();
            if (stringRefs && this.resolvedReference) {
                return {
                    corpusPath: this.resolvedReference.getObjectPath(),
                    identifier: this.constantValue
                };
            }
            else
                return this.constantValue;
        }
        //return p.measure(bodyCode);
    }
    copy() {
        //let bodyCode = () =>
        {
            this.checkForSwap();
            let copy = new StringConstant(this.expectedType, this.constantValue);
            copy.resolvedReference = this.resolvedReference;
            copy.resolvedParameter = this.resolvedParameter;
            return copy;
        }
        //return p.measure(bodyCode);
    }
    validate() {
        //let bodyCode = () =>
        {
            return this.constantValue ? true : false;
        }
        //return p.measure(bodyCode);
    }
    getFriendlyFormat() {
        //let bodyCode = () =>
        {
            let v = this.constantValue;
            if (!v)
                v = "null";
            v = v.replace("(resolvedAttributes)", "<resolvedAttributes>");
            if (!this.resolvedReference) {
                v = `"${v}"`;
            }
            return new friendlyFormatNode(v);
        }
        //return p.measure(bodyCode);
    }
    getObjectType() {
        //let bodyCode = () =>
        {
            return cdmObjectType.stringConstant;
        }
        //return p.measure(bodyCode);
    }
    getObjectRefType() {
        //let bodyCode = () =>
        {
            return cdmObjectType.unresolved;
        }
        //return p.measure(bodyCode);
    }
    getConstant() {
        //let bodyCode = () =>
        {
            // if string used as an argument
            if (this.resolvedReference)
                return null;
            return this.constantValue;
        }
        //return p.measure(bodyCode);
    }
    setExplanation(explanation) {
        return null;
    }
    checkForSwap() {
        //let bodyCode = () =>
        {
            if (this.resolvedReference) {
                if (this.resolvedReference.requestedName) {
                    // this is a promise, see if we can swap for it
                    if (this.resolvedReference.resolvedAtt)
                        this.resolvedReference = this.resolvedReference.resolvedAtt;
                }
            }
        }
        //return p.measure(bodyCode);
    }
    getObjectDef() {
        //let bodyCode = () =>
        {
            if (this.resolvedReference && this.resolvedReference.resolvedAtt)
                this.checkForSwap();
            return this.resolvedReference;
        }
        //return p.measure(bodyCode);
    }
    setObjectDef(def) {
        //let bodyCode = () =>
        {
            this.resolvedReference = def;
            return this.resolvedReference;
        }
        //return p.measure(bodyCode);
    }
    getAppliedTraitRefs() {
        return null;
    }
    addAppliedTrait(traitDef) {
        //let bodyCode = () =>
        {
            throw new Error("can't apply traits on simple reference");
        }
        //return p.measure(bodyCode);
    }
    setArgumentValue(name, value) {
        //let bodyCode = () =>
        {
            throw new Error("can't set argument value on simple reference");
        }
        //return p.measure(bodyCode);
    }
    getArgumentDefs() {
        //let bodyCode = () =>
        {
            // if string constant is used as a trait ref, there are no arguments
            return null;
        }
        //return p.measure(bodyCode);
    }
    addArgument(name, value) {
        //let bodyCode = () =>
        {
            throw new Error("can't set argument value on simple reference");
        }
        //return p.measure(bodyCode);
    }
    getExplanation() {
        //let bodyCode = () =>
        {
            // if string is used as a parameter def
            return null;
        }
        //return p.measure(bodyCode);
    }
    getName() {
        //let bodyCode = () =>
        {
            // if string is used as a parameter def
            return this.constantValue;
        }
        //return p.measure(bodyCode);
    }
    getDefaultValue() {
        //let bodyCode = () =>
        {
            // if string is used as a parameter def
            return null;
        }
        //return p.measure(bodyCode);
    }
    getRequired() {
        //let bodyCode = () =>
        {
            // if string is used as a parameter def
            return false;
        }
        //return p.measure(bodyCode);
    }
    getDirection() {
        //let bodyCode = () =>
        {
            // if string is used as a parameter def
            return "in";
        }
        //return p.measure(bodyCode);
    }
    getDataTypeRef() {
        //let bodyCode = () =>
        {
            // if string is used as a parameter def
            return null;
        }
        //return p.measure(bodyCode);
    }
    getValue() {
        //let bodyCode = () =>
        {
            // if string used as an argument
            if (this.resolvedReference)
                this.resolvedReference;
            return this;
        }
        //return p.measure(bodyCode);
    }
    setValue(value) {
        //let bodyCode = () =>
        {
            // if string used as an argument
            if (value.objectType == cdmObjectType.stringConstant)
                this.constantValue = value.constantValue;
        }
        //return p.measure(bodyCode);
    }
    getParameterDef() {
        //let bodyCode = () =>
        {
            // if string used as an argument
            return this.resolvedParameter;
        }
        //return p.measure(bodyCode);
    }
    visit(userData, pathRoot, preChildren, postChildren, statusRpt) {
        //let bodyCode = () =>
        {
            let path = this.declaredPath;
            if (!path) {
                if (!this.constantValue)
                    path = pathRoot + "XXXXX";
                else
                    path = pathRoot + this.constantValue;
                this.declaredPath = path;
            }
            //trackVisits(path);
            // not much to do
            if (preChildren && preChildren(userData, this, path, statusRpt))
                return false;
            if (postChildren && postChildren(userData, this, path, statusRpt))
                return true;
            return false;
        }
        //return p.measure(bodyCode);
    }
    constructResolvedAttributes() {
        //let bodyCode = () =>
        {
            if (this.resolvedReference) {
                let rasb = new ResolvedAttributeSetBuilder();
                rasb.takeReference(this.resolvedReference.getResolvedAttributes());
                // things that need to go away
                rasb.removeRequestedAtts();
                return rasb;
            }
            return null;
        }
        //return p.measure(bodyCode);
    }
    getResolvedEntityReferences() {
        //let bodyCode = () =>
        {
            if (this.resolvedReference && (this.resolvedReference.objectType == cdmObjectType.attributeGroupDef || this.resolvedReference.objectType == cdmObjectType.entityDef))
                return this.resolvedReference.getResolvedEntityReferences();
            return null;
        }
        //return p.measure(bodyCode);
    }
    constructResolvedTraits(rtsb) {
        //let bodyCode = () =>
        {
            if (this.resolvedReference) {
                if (rtsb.set == cdmTraitSet.inheritedOnly)
                    // this string is an implicit reference to an object def, get exhibited traits
                    rtsb.takeReference(this.resolvedReference.getResolvedTraits(cdmTraitSet.all));
                else if (rtsb.set == cdmTraitSet.elevatedOnly)
                    // this string is an implicit reference to an object def, get exhibited traits
                    rtsb.takeReference(this.resolvedReference.getResolvedTraits(rtsb.set));
                rtsb.cleanUp();
            }
        }
        //return p.measure(bodyCode);
    }
}
exports.StringConstant = StringConstant;
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
//
//  imports
//
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
class ImportImpl extends cdmObject {
    constructor(uri, moniker = undefined) {
        super();
        //let bodyCode = () =>
        {
            this.uri = uri;
            this.moniker = moniker ? moniker : undefined;
            this.objectType = cdmObjectType.import;
        }
        //return p.measure(bodyCode);
    }
    getObjectType() {
        //let bodyCode = () =>
        {
            return cdmObjectType.import;
        }
        //return p.measure(bodyCode);
    }
    getObjectRefType() {
        //let bodyCode = () =>
        {
            return cdmObjectType.unresolved;
        }
        //return p.measure(bodyCode);
    }
    getObjectDef() {
        //let bodyCode = () =>
        {
            return null;
        }
        //return p.measure(bodyCode);
    }
    copyData(stringRefs) {
        //let bodyCode = () =>
        {
            let castedToInterface = { moniker: this.moniker, uri: this.uri };
            return castedToInterface;
        }
        //return p.measure(bodyCode);
    }
    copy() {
        //let bodyCode = () =>
        {
            let copy = new ImportImpl(this.uri, this.moniker);
            copy.doc = this.doc;
            return copy;
        }
        //return p.measure(bodyCode);
    }
    validate() {
        //let bodyCode = () =>
        {
            return this.uri ? true : false;
        }
        //return p.measure(bodyCode);
    }
    getFriendlyFormat() {
        //let bodyCode = () =>
        {
            let ff = new friendlyFormatNode();
            ff.separator = " ";
            ff.addChildString("import *");
            ff.addChildString(this.moniker ? "as " + this.moniker : undefined);
            ff.addChildString("from");
            ff.addChildString(`${this.uri}`, true);
            return ff;
        }
        //return p.measure(bodyCode);
    }
    static createClass(object) {
        //let bodyCode = () =>
        {
            let imp = new ImportImpl(object.uri, object.moniker);
            return imp;
        }
        //return p.measure(bodyCode);
    }
    visit(userData, pathRoot, preChildren, postChildren, statusRpt) {
        //let bodyCode = () =>
        {
            // not much to do
            if (preChildren && preChildren(userData, this, pathRoot, statusRpt))
                return false;
            if (postChildren && postChildren(userData, this, pathRoot, statusRpt))
                return true;
            return false;
        }
        //return p.measure(bodyCode);
    }
    constructResolvedAttributes() {
        //let bodyCode = () =>
        {
            return null;
        }
        //return p.measure(bodyCode);
    }
    constructResolvedTraits(rtsb) {
        //let bodyCode = () =>
        {
        }
        //return p.measure(bodyCode);
    }
}
exports.ImportImpl = ImportImpl;
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
//
//  arguments and parameters on traits
//
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
//  {ArgumentDef}
////////////////////////////////////////////////////////////////////////////////////////////////////
class ArgumentImpl extends cdmObject {
    constructor() {
        super();
        //let bodyCode = () =>
        {
            this.objectType = cdmObjectType.argumentDef;
        }
        //return p.measure(bodyCode);
    }
    getObjectType() {
        //let bodyCode = () =>
        {
            return cdmObjectType.argumentDef;
        }
        //return p.measure(bodyCode);
    }
    getObjectRefType() {
        //let bodyCode = () =>
        {
            return cdmObjectType.unresolved;
        }
        //return p.measure(bodyCode);
    }
    getObjectDef() {
        //let bodyCode = () =>
        {
            return null;
        }
        //return p.measure(bodyCode);
    }
    copyData(stringRefs) {
        //let bodyCode = () =>
        {
            // skip the argument if just a value
            if (!this.name)
                return this.value;
            let castedToInterface = { explanation: this.explanation, name: this.name, value: this.value.copyData(stringRefs) };
            return castedToInterface;
        }
        //return p.measure(bodyCode);
    }
    copy() {
        //let bodyCode = () =>
        {
            let copy = new ArgumentImpl();
            copy.name = this.name;
            copy.value = this.value.copy();
            copy.resolvedParameter = this.resolvedParameter;
            copy.explanation = this.explanation;
            return copy;
        }
        //return p.measure(bodyCode);
    }
    validate() {
        //let bodyCode = () =>
        {
            return this.value ? true : false;
        }
        //return p.measure(bodyCode);
    }
    getFriendlyFormat() {
        //let bodyCode = () =>
        {
            let ff = new friendlyFormatNode();
            ff.separator = ": ";
            ff.addChildString(this.name);
            ff.addChild(this.value.getFriendlyFormat());
            ff.addComment(this.explanation);
            return ff;
        }
        //return p.measure(bodyCode);
    }
    static createClass(object) {
        //let bodyCode = () =>
        {
            let c = new ArgumentImpl();
            if (object.value) {
                c.value = cdmObject.createConstant(object.value);
                if (object.name)
                    c.name = object.name;
                if (object.explanation)
                    c.explanation = object.explanation;
            }
            else {
                // not a structured argument, just a thing. try it
                c.value = cdmObject.createConstant(object);
            }
            return c;
        }
        //return p.measure(bodyCode);
    }
    getExplanation() {
        //let bodyCode = () =>
        {
            return this.explanation;
        }
        //return p.measure(bodyCode);
    }
    setExplanation(explanation) {
        //let bodyCode = () =>
        {
            this.explanation = explanation;
            return this.explanation;
        }
        //return p.measure(bodyCode);
    }
    getValue() {
        //let bodyCode = () =>
        {
            return this.value;
        }
        //return p.measure(bodyCode);
    }
    setValue(value) {
        //let bodyCode = () =>
        {
            this.value = value;
        }
        //return p.measure(bodyCode);
    }
    getName() {
        //let bodyCode = () =>
        {
            return this.name;
        }
        //return p.measure(bodyCode);
    }
    getParameterDef() {
        //let bodyCode = () =>
        {
            return this.resolvedParameter;
        }
        //return p.measure(bodyCode);
    }
    visit(userData, pathRoot, preChildren, postChildren, statusRpt) {
        //let bodyCode = () =>
        {
            let path = this.declaredPath;
            if (!path) {
                path = pathRoot + (this.value ? "value/" : "");
                this.declaredPath = path;
            }
            //trackVisits(path);
            if (preChildren && preChildren(userData, this, path, statusRpt))
                return false;
            if (this.value)
                if (this.value.visit(userData, path, preChildren, postChildren, statusRpt))
                    return true;
            if (postChildren && postChildren(userData, this, path, statusRpt))
                return true;
            return false;
        }
        //return p.measure(bodyCode);
    }
    constructResolvedAttributes() {
        //let bodyCode = () =>
        {
            // no way for attributes to come up from an argument
            return null;
        }
        //return p.measure(bodyCode);
    }
    constructResolvedTraits(rtsb) {
        //let bodyCode = () =>
        {
            return null;
        }
        //return p.measure(bodyCode);
    }
}
exports.ArgumentImpl = ArgumentImpl;
////////////////////////////////////////////////////////////////////////////////////////////////////
//  {ParameterDef}
////////////////////////////////////////////////////////////////////////////////////////////////////
class ParameterImpl extends cdmObject {
    constructor(name) {
        super();
        //let bodyCode = () =>
        {
            this.name = name;
            this.objectType = cdmObjectType.parameterDef;
        }
        //return p.measure(bodyCode);
    }
    getObjectType() {
        //let bodyCode = () =>
        {
            return cdmObjectType.parameterDef;
        }
        //return p.measure(bodyCode);
    }
    getObjectRefType() {
        //let bodyCode = () =>
        {
            return cdmObjectType.unresolved;
        }
        //return p.measure(bodyCode);
    }
    getObjectDef() {
        //let bodyCode = () =>
        {
            return null;
        }
        //return p.measure(bodyCode);
    }
    copyData(stringRefs) {
        //let bodyCode = () =>
        {
            let castedToInterface = {
                explanation: this.explanation,
                name: this.name,
                defaultValue: this.defaultValue ? this.defaultValue.copyData(stringRefs) : undefined,
                required: this.required,
                direction: this.direction,
                dataType: this.dataType ? this.dataType.copyData(stringRefs) : undefined
            };
            return castedToInterface;
        }
        //return p.measure(bodyCode);
    }
    copy() {
        //let bodyCode = () =>
        {
            let copy = new ParameterImpl(this.name);
            copy.explanation = this.explanation;
            copy.defaultValue = this.defaultValue ? this.defaultValue.copy() : undefined;
            copy.required = this.required;
            copy.direction = this.direction;
            copy.dataType = this.dataType ? this.dataType.copy() : undefined;
            return copy;
        }
        //return p.measure(bodyCode);
    }
    validate() {
        //let bodyCode = () =>
        {
            return this.name ? true : false;
        }
        //return p.measure(bodyCode);
    }
    getFriendlyFormat() {
        //let bodyCode = () =>
        {
            let ff = new friendlyFormatNode();
            ff.separator = " ";
            ff.addChildString(this.required ? "required" : undefined);
            ff.addChildString(this.direction);
            ff.addChild(this.dataType.getFriendlyFormat());
            ff.addChildString(this.name);
            if (this.defaultValue) {
                ff.addChildString("=");
                ff.addChild(this.defaultValue.getFriendlyFormat());
            }
            ff.addComment(this.explanation);
            return ff;
        }
        //return p.measure(bodyCode);
    }
    static createClass(object) {
        //let bodyCode = () =>
        {
            let c = new ParameterImpl(object.name);
            c.explanation = object.explanation;
            c.required = object.required ? object.required : false;
            c.direction = object.direction ? object.direction : "in";
            c.defaultValue = cdmObject.createConstant(object.defaultValue);
            c.dataType = cdmObject.createDataTypeReference(object.dataType);
            return c;
        }
        //return p.measure(bodyCode);
    }
    getExplanation() {
        //let bodyCode = () =>
        {
            return this.explanation;
        }
        //return p.measure(bodyCode);
    }
    getName() {
        //let bodyCode = () =>
        {
            return this.name;
        }
        //return p.measure(bodyCode);
    }
    getDefaultValue() {
        //let bodyCode = () =>
        {
            return this.defaultValue;
        }
        //return p.measure(bodyCode);
    }
    getRequired() {
        //let bodyCode = () =>
        {
            return this.required;
        }
        //return p.measure(bodyCode);
    }
    getDirection() {
        //let bodyCode = () =>
        {
            return this.direction;
        }
        //return p.measure(bodyCode);
    }
    getDataTypeRef() {
        //let bodyCode = () =>
        {
            return this.dataType;
        }
        //return p.measure(bodyCode);
    }
    visit(userData, pathRoot, preChildren, postChildren, statusRpt) {
        //let bodyCode = () =>
        {
            let path = this.declaredPath;
            if (!path) {
                path = pathRoot + this.name;
                this.declaredPath = path;
            }
            //trackVisits(path);
            if (preChildren && preChildren(userData, this, path, statusRpt))
                return false;
            if (this.defaultValue)
                if (this.defaultValue.visit(userData, path + "/defaultValue/", preChildren, postChildren, statusRpt))
                    return true;
            if (this.dataType)
                if (this.dataType.visit(userData, path + "/dataType/", preChildren, postChildren, statusRpt))
                    return true;
            if (postChildren && postChildren(userData, this, path, statusRpt))
                return true;
            return false;
        }
        //return p.measure(bodyCode);
    }
    constructResolvedAttributes() {
        //let bodyCode = () =>
        {
            return null;
        }
        //return p.measure(bodyCode);
    }
    constructResolvedTraits(rtsb) {
        //let bodyCode = () =>
        {
            return null;
        }
        //return p.measure(bodyCode);
    }
}
exports.ParameterImpl = ParameterImpl;
let addTraitRef = (collection, traitDef) => {
    //let bodyCode = () =>
    {
        let trait;
        if (typeof traitDef === "string")
            trait = new StringConstant(cdmObjectType.traitRef, traitDef);
        else if (traitDef.objectType == cdmObjectType.traitDef)
            trait = traitDef;
        else if (traitDef.objectType == cdmObjectType.traitRef) {
            collection.push(traitDef);
            return traitDef;
        }
        let tRef = new TraitReferenceImpl(trait, false);
        collection.push(tRef);
        return tRef;
    }
    //return p.measure(bodyCode);
};
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
//
//  base classes for definitions and references
//
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
//  {ObjectDef}
////////////////////////////////////////////////////////////////////////////////////////////////////
class cdmObjectDef extends cdmObject {
    //baseCache : Set<string>;
    constructor(exhibitsTraits = false) {
        super();
        //let bodyCode = () =>
        {
            if (exhibitsTraits)
                this.exhibitsTraits = new Array();
        }
        //return p.measure(bodyCode);
    }
    copyDef(copy) {
        //let bodyCode = () =>
        {
            copy.explanation = this.explanation;
            copy.exhibitsTraits = cdmObject.arrayCopy(this.exhibitsTraits);
        }
        //return p.measure(bodyCode);
    }
    getFriendlyFormatDef(under) {
        //let bodyCode = () =>
        {
            if (this.exhibitsTraits && this.exhibitsTraits.length) {
                let ff = new friendlyFormatNode();
                ff.separator = " ";
                ff.addChildString("exhibits");
                let ffT = new friendlyFormatNode();
                ffT.separator = ", ";
                ffT.lineWrap = true;
                cdmObject.arrayGetFriendlyFormat(ffT, this.exhibitsTraits);
                ff.addChild(ffT);
                under.addChild(ff);
            }
            under.addComment(this.explanation);
        }
        //return p.measure(bodyCode);
    }
    getObjectDef() {
        //let bodyCode = () =>
        {
            return this;
        }
        //return p.measure(bodyCode);
    }
    getExplanation() {
        //let bodyCode = () =>
        {
            return this.explanation;
        }
        //return p.measure(bodyCode);
    }
    setExplanation(explanation) {
        this.explanation = explanation;
        return this.explanation;
    }
    getExhibitedTraitRefs() {
        //let bodyCode = () =>
        {
            return this.exhibitsTraits;
        }
        //return p.measure(bodyCode);
    }
    addExhibitedTrait(traitDef) {
        //let bodyCode = () =>
        {
            if (!traitDef)
                return null;
            this.clearTraitCache();
            if (!this.exhibitsTraits)
                this.exhibitsTraits = new Array();
            return addTraitRef(this.exhibitsTraits, traitDef);
        }
        //return p.measure(bodyCode);
    }
    visitDef(userData, pathRoot, preChildren, postChildren, statusRpt) {
        //let bodyCode = () =>
        {
            if (this.exhibitsTraits)
                if (cdmObject.visitArray(this.exhibitsTraits, userData, pathRoot + "/exhibitsTraits/", preChildren, postChildren, statusRpt))
                    return true;
            return false;
        }
        //return p.measure(bodyCode);
    }
    isDerivedFromDef(base, name, seek) {
        //let bodyCode = () =>
        {
            if (seek == name)
                return true;
            if (base && base.getObjectDef())
                return base.getObjectDef().isDerivedFrom(seek);
            return false;
        }
        //return p.measure(bodyCode);
    }
    constructResolvedTraitsDef(base, rtsb) {
        //let bodyCode = () =>
        {
            let set = rtsb.set;
            if (set == cdmTraitSet.inheritedOnly)
                set = cdmTraitSet.all;
            // get from base class first, then see if some are applied to base class on ref then add any traits exhibited by this def
            if (base) {
                // merge in all from base class
                rtsb.mergeTraits(base.getResolvedTraits(set));
            }
            // merge in any that are exhibited by this class
            if (this.exhibitsTraits) {
                this.exhibitsTraits.forEach(et => {
                    rtsb.mergeTraits(et.getResolvedTraits(set));
                });
            }
        }
        //return p.measure(bodyCode);
    }
    getObjectPath() {
        //let bodyCode = () =>
        {
            return this.corpusPath;
        }
        //return p.measure(bodyCode);
    }
}
////////////////////////////////////////////////////////////////////////////////////////////////////
//  {ObjectRef}
////////////////////////////////////////////////////////////////////////////////////////////////////
class cdmObjectRef extends cdmObject {
    constructor(appliedTraits) {
        super();
        //let bodyCode = () =>
        {
            if (appliedTraits)
                this.appliedTraits = new Array();
        }
        //return p.measure(bodyCode);
    }
    copyRef(copy) {
        //let bodyCode = () =>
        {
            copy.appliedTraits = cdmObject.arrayCopy(this.appliedTraits);
        }
        //return p.measure(bodyCode);
    }
    getFriendlyFormatRef(under) {
        //let bodyCode = () =>
        {
            if (this.appliedTraits && this.appliedTraits.length) {
                let ff = new friendlyFormatNode();
                ff.separator = ", ";
                ff.lineWrap = true;
                ff.starter = "[";
                ff.terminator = "]";
                cdmObject.arrayGetFriendlyFormat(ff, this.appliedTraits);
                under.addChild(ff);
            }
        }
        //return p.measure(bodyCode);
    }
    getAppliedTraitRefs() {
        //let bodyCode = () =>
        {
            return this.appliedTraits;
        }
        //return p.measure(bodyCode);
    }
    addAppliedTrait(traitDef) {
        //let bodyCode = () =>
        {
            if (!traitDef)
                return null;
            this.clearTraitCache();
            if (!this.appliedTraits)
                this.appliedTraits = new Array();
            return addTraitRef(this.appliedTraits, traitDef);
        }
        //return p.measure(bodyCode);
    }
    visitRef(userData, pathRoot, preChildren, postChildren, statusRpt) {
        //let bodyCode = () =>
        {
            if (this.appliedTraits)
                if (cdmObject.visitArray(this.appliedTraits, userData, pathRoot + "/appliedTraits/", preChildren, postChildren, statusRpt))
                    return true;
            return false;
        }
        //return p.measure(bodyCode);
    }
    constructResolvedAttributes() {
        //let bodyCode = () =>
        {
            // find and cache the complete set of attributes
            let rasb = new ResolvedAttributeSetBuilder();
            rasb.takeReference(this.getObjectDef().getResolvedAttributes());
            rasb.applyTraits(this.getResolvedTraits(cdmTraitSet.appliedOnly));
            rasb.removeRequestedAtts();
            return rasb;
        }
        //return p.measure(bodyCode);
    }
    constructResolvedTraits(rtsb) {
        //let bodyCode = () =>
        {
            let set = rtsb.set;
            let objDef = this.getObjectDef();
            if (set == cdmTraitSet.inheritedOnly) {
                if (objDef)
                    rtsb.takeReference(objDef.getResolvedTraits(cdmTraitSet.all));
                return;
            }
            if (set == cdmTraitSet.appliedOnly)
                set = cdmTraitSet.all;
            if (set == cdmTraitSet.elevatedOnly) {
                if (objDef)
                    rtsb.takeReference(objDef.getResolvedTraits(set));
                return;
            }
            if (this.appliedTraits) {
                this.appliedTraits.forEach(at => {
                    rtsb.mergeTraits(at.getResolvedTraits(set));
                });
            }
            rtsb.cleanUp();
        }
        //return p.measure(bodyCode);
    }
}
exports.cdmObjectRef = cdmObjectRef;
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
//
//  Traits
//
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
//  {TraitRef}
////////////////////////////////////////////////////////////////////////////////////////////////////
class TraitReferenceImpl extends cdmObjectRef {
    constructor(trait, hasArguments) {
        super(false);
        //let bodyCode = () =>
        {
            this.trait = trait;
            if (hasArguments)
                this.arguments = new Array();
            this.objectType = cdmObjectType.traitRef;
        }
        //return p.measure(bodyCode);
    }
    getObjectType() {
        //let bodyCode = () =>
        {
            return cdmObjectType.traitRef;
        }
        //return p.measure(bodyCode);
    }
    getObjectRefType() {
        //let bodyCode = () =>
        {
            return cdmObjectType.unresolved;
        }
        //return p.measure(bodyCode);
    }
    copyData(stringRefs) {
        //let bodyCode = () =>
        {
            let castedToInterface = {
                traitReference: this.trait.copyData(stringRefs),
                arguments: cdmObject.arraycopyData(this.arguments, stringRefs)
            };
            return castedToInterface;
        }
        //return p.measure(bodyCode);
    }
    copy() {
        //let bodyCode = () =>
        {
            let copy = new TraitReferenceImpl(this.trait, false);
            copy.arguments = cdmObject.arrayCopy(this.arguments);
            this.copyRef(copy);
            return copy;
        }
        //return p.measure(bodyCode);
    }
    validate() {
        //let bodyCode = () =>
        {
            return this.trait ? true : false;
        }
        //return p.measure(bodyCode);
    }
    getFriendlyFormat() {
        //let bodyCode = () =>
        {
            let ff = new friendlyFormatNode();
            ff.addChildString(this.trait.getName());
            let ffSub = new friendlyFormatNode();
            ffSub.separator = ", ";
            ffSub.lineWrap = true;
            ffSub.starter = "(";
            ffSub.terminator = ")";
            ffSub.bracketEmpty = true;
            cdmObject.arrayGetFriendlyFormat(ffSub, this.arguments);
            ff.addChild(ffSub);
            return ff;
        }
        //return p.measure(bodyCode);
    }
    static createClass(object) {
        //let bodyCode = () =>
        {
            let trait = cdmObject.createStringOrImpl(object.traitReference, cdmObjectType.traitRef, TraitImpl.createClass);
            let c = new TraitReferenceImpl(trait, object.arguments);
            if (object.arguments) {
                object.arguments.forEach(a => {
                    c.arguments.push(cdmObject.createStringOrImpl(a, cdmObjectType.argumentDef, ArgumentImpl.createClass));
                });
            }
            return c;
        }
        //return p.measure(bodyCode);
    }
    getObjectDef() {
        //let bodyCode = () =>
        {
            return this.trait.getObjectDef();
        }
        //return p.measure(bodyCode);
    }
    setObjectDef(def) {
        //let bodyCode = () =>
        {
            this.trait = def;
            return this.trait.getObjectDef();
        }
        //return p.measure(bodyCode);
    }
    getArgumentDefs() {
        //let bodyCode = () =>
        {
            return this.arguments;
        }
        //return p.measure(bodyCode);
    }
    addArgument(name, value) {
        //let bodyCode = () =>
        {
            if (!this.arguments)
                this.arguments = new Array();
            let newArg = Corpus.MakeObject(cdmObjectType.argumentDef, name);
            newArg.setValue(value);
            this.arguments.push(newArg);
            return newArg;
        }
        //return p.measure(bodyCode);
    }
    setArgumentValue(name, value) {
        //let bodyCode = () =>
        {
            let valueObj = new StringConstant(cdmObjectType.unresolved, value);
            if (!this.arguments)
                this.arguments = new Array();
            let iArgSet = 0;
            for (iArgSet = 0; iArgSet < this.arguments.length; iArgSet++) {
                const arg = this.arguments[iArgSet];
                if (arg.getName() == name) {
                    arg.setValue(valueObj);
                }
            }
            if (iArgSet == this.arguments.length) {
                let arg = new ArgumentImpl();
                arg.name = name;
                arg.value = valueObj;
            }
        }
        //return p.measure(bodyCode);
    }
    visit(userData, pathRoot, preChildren, postChildren, statusRpt) {
        //let bodyCode = () =>
        {
            let path = this.declaredPath;
            if (!path) {
                path = pathRoot;
                if (this.trait.objectType === cdmObjectType.stringConstant)
                    path = pathRoot + this.trait.constantValue;
                else
                    path = pathRoot;
                this.declaredPath = path;
            }
            //trackVisits(path);
            if (preChildren && preChildren(userData, this, path, statusRpt))
                return false;
            if (this.trait)
                if (this.trait.visit(userData, path, preChildren, postChildren, statusRpt))
                    return true;
            if (this.arguments)
                if (cdmObject.visitArray(this.arguments, userData, path + "/arguments/", preChildren, postChildren, statusRpt))
                    return true;
            if (postChildren && postChildren(userData, this, path, statusRpt))
                return true;
            return false;
        }
        //return p.measure(bodyCode);
    }
    constructResolvedAttributes() {
        //let bodyCode = () =>
        {
            return null;
        }
        //return p.measure(bodyCode);
    }
    constructResolvedTraits(rtsb) {
        //let bodyCode = () =>
        {
            let set = rtsb.set;
            if (set != cdmTraitSet.appliedOnly) {
                if (set == cdmTraitSet.inheritedOnly)
                    set = cdmTraitSet.all;
                // get referenced trait
                let trait = this.getObjectDef();
                if (trait) {
                    // get the set of resolutions, should just be this one trait
                    rtsb.takeReference(trait.getResolvedTraits(set));
                    // now if there are argument for this application, set the values in the array
                    if (this.arguments) {
                        this.arguments.forEach(a => {
                            rtsb.setParameterValueFromArgument(trait, a);
                        });
                    }
                }
            }
            rtsb.cleanUp();
        }
        //return p.measure(bodyCode);
    }
}
exports.TraitReferenceImpl = TraitReferenceImpl;
////////////////////////////////////////////////////////////////////////////////////////////////////
//  {TraitDef}
////////////////////////////////////////////////////////////////////////////////////////////////////
class TraitImpl extends cdmObjectDef {
    constructor(name, extendsTrait, hasParameters = false) {
        super();
        //let bodyCode = () =>
        {
            this.hasSetFlags = false;
            this.objectType = cdmObjectType.traitDef;
            this.traitName = name;
            this.extendsTrait = extendsTrait;
            if (hasParameters)
                this.hasParameters = new Array();
        }
        //return p.measure(bodyCode);
    }
    getObjectType() {
        //let bodyCode = () =>
        {
            return cdmObjectType.traitDef;
        }
        //return p.measure(bodyCode);
    }
    getObjectRefType() {
        //let bodyCode = () =>
        {
            return cdmObjectType.traitRef;
        }
        //return p.measure(bodyCode);
    }
    copyData(stringRefs) {
        //let bodyCode = () =>
        {
            let castedToInterface = {
                explanation: this.explanation,
                traitName: this.traitName,
                extendsTrait: this.extendsTrait ? this.extendsTrait.copyData(stringRefs) : undefined,
                hasParameters: cdmObject.arraycopyData(this.hasParameters, stringRefs),
                elevated: this.elevated,
                modifiesAttributes: this.modifiesAttributes,
                ugly: this.ugly
            };
            return castedToInterface;
        }
        //return p.measure(bodyCode);
    }
    copy() {
        //let bodyCode = () =>
        {
            let copy = new TraitImpl(this.traitName, null, false);
            copy.extendsTrait = this.extendsTrait ? this.extendsTrait.copy() : undefined,
                copy.hasParameters = cdmObject.arrayCopy(this.hasParameters);
            copy.allParameters = null;
            copy.elevated = this.elevated;
            copy.ugly = this.ugly;
            copy.modifiesAttributes = this.modifiesAttributes;
            this.copyDef(copy);
            return copy;
        }
        //return p.measure(bodyCode);
    }
    validate() {
        //let bodyCode = () =>
        {
            return this.traitName ? true : false;
        }
        //return p.measure(bodyCode);
    }
    getFriendlyFormat() {
        //let bodyCode = () =>
        {
            let ff = new friendlyFormatNode();
            ff.separator = " ";
            ff.addChildString("trait");
            ff.addChildString(this.traitName);
            if (this.extendsTrait) {
                ff.addChildString("extends");
                ff.addChild(this.extendsTrait.getFriendlyFormat());
            }
            this.getFriendlyFormatDef(ff);
            if (this.hasParameters) {
                let ffSub = new friendlyFormatNode();
                ffSub.forceWrap = true;
                //ffSub.verticalMode = true;
                ffSub.bracketEmpty = true;
                ffSub.separator = ";";
                ffSub.starter = "{";
                ffSub.terminator = "}";
                cdmObject.arrayGetFriendlyFormat(ffSub, this.hasParameters);
                ff.addChild(ffSub);
            }
            return ff;
        }
        //return p.measure(bodyCode);
    }
    static createClass(object) {
        //let bodyCode = () =>
        {
            let extendsTrait;
            extendsTrait = cdmObject.createStringOrImpl(object.extendsTrait, cdmObjectType.traitRef, TraitReferenceImpl.createClass);
            let c = new TraitImpl(object.traitName, extendsTrait, object.hasParameters);
            if (object.explanation)
                c.explanation = object.explanation;
            if (object.hasParameters) {
                object.hasParameters.forEach(ap => {
                    c.hasParameters.push(cdmObject.createStringOrImpl(ap, cdmObjectType.parameterDef, ParameterImpl.createClass));
                });
            }
            if (object.elevated != undefined)
                c.elevated = object.elevated;
            if (object.ugly != undefined)
                c.ugly = object.ugly;
            if (object.modifiesAttributes != undefined)
                c.modifiesAttributes = object.modifiesAttributes;
            return c;
        }
        //return p.measure(bodyCode);
    }
    getExplanation() {
        //let bodyCode = () =>
        {
            return this.explanation;
        }
        //return p.measure(bodyCode);
    }
    getName() {
        //let bodyCode = () =>
        {
            return this.traitName;
        }
        //return p.measure(bodyCode);
    }
    getExtendsTrait() {
        //let bodyCode = () =>
        {
            return this.extendsTrait;
        }
        //return p.measure(bodyCode);
    }
    setExtendsTrait(traitDef) {
        //let bodyCode = () =>
        {
            if (!traitDef)
                return null;
            this.clearTraitCache();
            let extRef = new Array();
            addTraitRef(extRef, traitDef);
            this.extendsTrait = extRef[0];
            return this.extendsTrait;
        }
        //return p.measure(bodyCode);
    }
    getHasParameterDefs() {
        //let bodyCode = () =>
        {
            return this.hasParameters;
        }
        //return p.measure(bodyCode);
    }
    getExhibitedTraitRefs() {
        //let bodyCode = () =>
        {
            return null;
        }
        //return p.measure(bodyCode);
    }
    isDerivedFrom(base) {
        //let bodyCode = () =>
        {
            if (base === this.traitName)
                return true;
            return this.isDerivedFromDef(this.extendsTrait, this.traitName, base);
        }
        //return p.measure(bodyCode);
    }
    visit(userData, pathRoot, preChildren, postChildren, statusRpt) {
        //let bodyCode = () =>
        {
            let path = this.declaredPath;
            if (!path) {
                path = pathRoot + this.traitName;
                this.declaredPath = path;
            }
            //trackVisits(path);
            if (preChildren && preChildren(userData, this, path, statusRpt))
                return false;
            if (this.extendsTrait)
                if (this.extendsTrait.visit(userData, path + "/extendsTrait/", preChildren, postChildren, statusRpt))
                    return true;
            if (this.hasParameters)
                if (cdmObject.visitArray(this.hasParameters, userData, path + "/hasParameters/", preChildren, postChildren, statusRpt))
                    return true;
            if (postChildren && postChildren(userData, this, path, statusRpt))
                return true;
            return false;
        }
        //return p.measure(bodyCode);
    }
    addTraitApplier(applier) {
        //let bodyCode = () =>
        {
            if (!this.appliers)
                this.appliers = new Array();
            this.appliers.push(applier);
        }
        //return p.measure(bodyCode);
    }
    getTraitAppliers() {
        //let bodyCode = () =>
        {
            return this.appliers;
        }
        //return p.measure(bodyCode);
    }
    constructResolvedTraits(rtsb) {
        //let bodyCode = () =>
        {
            let set = rtsb.set;
            if (set != cdmTraitSet.appliedOnly) {
                if (set == cdmTraitSet.elevatedOnly && !this.elevated) {
                    // stop now. won't keep these anyway
                    return;
                }
                if (set == cdmTraitSet.inheritedOnly)
                    set = cdmTraitSet.all;
                let baseValues;
                if (this.extendsTrait) {
                    // get the resolution of the base class and use the values as a starting point for this trait's values
                    let base = this.extendsTrait.getResolvedTraits(set);
                    if (base)
                        baseValues = base.get(this.extendsTrait.getObjectDef()).parameterValues.values;
                    if (this.hasSetFlags == false) {
                        // inherit these flags
                        let baseTrait = this.extendsTrait.getObjectDef();
                        if (this.elevated == undefined)
                            this.elevated = baseTrait.elevated;
                        if (this.ugly == undefined)
                            this.ugly = baseTrait.ugly;
                        if (this.modifiesAttributes == undefined)
                            this.modifiesAttributes = baseTrait.modifiesAttributes;
                    }
                }
                this.hasSetFlags = true;
                let pc = this.getAllParameters();
                let av = new Array();
                for (let i = 0; i < pc.sequence.length; i++) {
                    // either use the default value or (higher precidence) the value taken from the base reference
                    let value = pc.sequence[i].defaultValue;
                    let baseValue;
                    if (baseValues && i < baseValues.length) {
                        baseValue = baseValues[i];
                        if (baseValue)
                            value = baseValue;
                    }
                    av.push(value);
                }
                rtsb.ownOne(new ResolvedTrait(this, pc, av));
            }
        }
        //return p.measure(bodyCode);
    }
    getAllParameters() {
        //let bodyCode = () =>
        {
            if (this.allParameters)
                return this.allParameters;
            // get parameters from base if there is one
            let prior;
            if (this.extendsTrait)
                prior = this.getExtendsTrait().getObjectDef().getAllParameters();
            this.allParameters = new ParameterCollection(prior);
            if (this.hasParameters) {
                this.hasParameters.forEach(element => {
                    this.allParameters.add(element);
                });
            }
            return this.allParameters;
        }
        //return p.measure(bodyCode);
    }
    constructResolvedAttributes() {
        //let bodyCode = () =>
        {
            return null;
        }
        //return p.measure(bodyCode);
    }
}
exports.TraitImpl = TraitImpl;
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
//
//  relationships
//
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
//  {RelationshipRef}
////////////////////////////////////////////////////////////////////////////////////////////////////
class RelationshipReferenceImpl extends cdmObjectRef {
    constructor(relationship, appliedTraits) {
        super(appliedTraits);
        //let bodyCode = () =>
        {
            this.objectType = cdmObjectType.relationshipRef;
            this.relationship = relationship;
        }
        //return p.measure(bodyCode);
    }
    getObjectType() {
        //let bodyCode = () =>
        {
            return cdmObjectType.relationshipRef;
        }
        //return p.measure(bodyCode);
    }
    getObjectRefType() {
        //let bodyCode = () =>
        {
            return cdmObjectType.unresolved;
        }
        //return p.measure(bodyCode);
    }
    copyData(stringRefs) {
        //let bodyCode = () =>
        {
            let castedToInterface = {
                relationshipReference: this.relationship.copyData(stringRefs),
                appliedTraits: cdmObject.arraycopyData(this.appliedTraits, stringRefs)
            };
            return castedToInterface;
        }
        //return p.measure(bodyCode);
    }
    copy() {
        //let bodyCode = () =>
        {
            let copy = new RelationshipReferenceImpl(null, false);
            copy.relationship = this.relationship.copy();
            this.copyRef(copy);
            return copy;
        }
        //return p.measure(bodyCode);
    }
    validate() {
        //let bodyCode = () =>
        {
            return this.relationship ? true : false;
        }
        //return p.measure(bodyCode);
    }
    getFriendlyFormat() {
        //let bodyCode = () =>
        {
            let ff = new friendlyFormatNode();
            ff.separator = " ";
            ff.addChild(this.relationship.getFriendlyFormat());
            this.getFriendlyFormatRef(ff);
            return ff;
        }
        //return p.measure(bodyCode);
    }
    static createClass(object) {
        //let bodyCode = () =>
        {
            let relationship = cdmObject.createStringOrImpl(object.relationshipReference, cdmObjectType.relationshipRef, RelationshipImpl.createClass);
            let c = new RelationshipReferenceImpl(relationship, object.appliedTraits);
            c.appliedTraits = cdmObject.createTraitReferenceArray(object.appliedTraits);
            return c;
        }
        //return p.measure(bodyCode);
    }
    getObjectDef() {
        //let bodyCode = () =>
        {
            return this.relationship.getObjectDef();
        }
        //return p.measure(bodyCode);
    }
    setObjectDef(def) {
        //let bodyCode = () =>
        {
            this.relationship = def;
            return this.relationship.getObjectDef();
        }
        //return p.measure(bodyCode);
    }
    visit(userData, pathRoot, preChildren, postChildren, statusRpt) {
        //let bodyCode = () =>
        {
            let path = this.declaredPath;
            if (!path) {
                if (this.relationship.objectType === cdmObjectType.stringConstant)
                    path = pathRoot + this.relationship.constantValue;
                else
                    path = pathRoot;
                this.declaredPath = path;
            }
            //trackVisits(path);
            if (preChildren && preChildren(userData, this, path, statusRpt))
                return false;
            if (this.relationship)
                if (this.relationship.visit(userData, path, preChildren, postChildren, statusRpt))
                    return true;
            if (this.visitRef(userData, path, preChildren, postChildren, statusRpt))
                return true;
            if (postChildren && postChildren(userData, this, path, statusRpt))
                return true;
            return false;
        }
        //return p.measure(bodyCode);
    }
}
exports.RelationshipReferenceImpl = RelationshipReferenceImpl;
////////////////////////////////////////////////////////////////////////////////////////////////////
//  {RelationshipDef}
////////////////////////////////////////////////////////////////////////////////////////////////////
class RelationshipImpl extends cdmObjectDef {
    constructor(relationshipName, extendsRelationship, exhibitsTraits = false) {
        super(exhibitsTraits);
        //let bodyCode = () =>
        {
            this.objectType = cdmObjectType.relationshipDef;
            this.relationshipName = relationshipName;
            if (extendsRelationship)
                this.extendsRelationship = extendsRelationship;
        }
        //return p.measure(bodyCode);
    }
    getObjectType() {
        //let bodyCode = () =>
        {
            return cdmObjectType.relationshipDef;
        }
        //return p.measure(bodyCode);
    }
    getObjectRefType() {
        //let bodyCode = () =>
        {
            return cdmObjectType.relationshipRef;
        }
        //return p.measure(bodyCode);
    }
    copyData(stringRefs) {
        //let bodyCode = () =>
        {
            let castedToInterface = {
                explanation: this.explanation,
                relationshipName: this.relationshipName,
                extendsRelationship: this.extendsRelationship ? this.extendsRelationship.copyData(stringRefs) : undefined,
                exhibitsTraits: cdmObject.arraycopyData(this.exhibitsTraits, stringRefs)
            };
            return castedToInterface;
        }
        //return p.measure(bodyCode);
    }
    copy() {
        //let bodyCode = () =>
        {
            let copy = new RelationshipImpl(this.relationshipName, null, false);
            copy.extendsRelationship = this.extendsRelationship ? this.extendsRelationship.copy() : undefined;
            this.copyDef(copy);
            return copy;
        }
        //return p.measure(bodyCode);
    }
    validate() {
        return this.relationshipName ? true : false;
    }
    getFriendlyFormat() {
        //let bodyCode = () =>
        {
            let ff = new friendlyFormatNode();
            ff.separator = " ";
            ff.addChildString("relationship");
            ff.addChildString(this.relationshipName);
            if (this.extendsRelationship) {
                ff.addChildString("extends");
                ff.addChild(this.extendsRelationship.getFriendlyFormat());
            }
            this.getFriendlyFormatDef(ff);
            return ff;
        }
        //return p.measure(bodyCode);
    }
    static createClass(object) {
        //let bodyCode = () =>
        {
            let extendsRelationship;
            extendsRelationship = cdmObject.createRelationshipReference(object.extendsRelationship);
            let c = new RelationshipImpl(object.relationshipName, extendsRelationship, object.exhibitsTraits);
            if (object.explanation)
                c.explanation = object.explanation;
            c.exhibitsTraits = cdmObject.createTraitReferenceArray(object.exhibitsTraits);
            return c;
        }
        //return p.measure(bodyCode);
    }
    getName() {
        //let bodyCode = () =>
        {
            return this.relationshipName;
        }
        //return p.measure(bodyCode);
    }
    getExtendsRelationshipRef() {
        //let bodyCode = () =>
        {
            return this.extendsRelationship;
        }
        //return p.measure(bodyCode);
    }
    visit(userData, pathRoot, preChildren, postChildren, statusRpt) {
        //let bodyCode = () =>
        {
            let path = this.declaredPath;
            if (!path) {
                path = pathRoot + this.relationshipName;
                this.declaredPath = path;
            }
            //trackVisits(path);
            if (preChildren && preChildren(userData, this, path, statusRpt))
                return false;
            if (this.extendsRelationship)
                if (this.extendsRelationship.visit(userData, path + "/extendsRelationship/", preChildren, postChildren, statusRpt))
                    return true;
            if (this.visitDef(userData, path, preChildren, postChildren, statusRpt))
                return true;
            if (postChildren && postChildren(userData, this, path, statusRpt))
                return true;
            return false;
        }
        //return p.measure(bodyCode);
    }
    isDerivedFrom(base) {
        //let bodyCode = () =>
        {
            return this.isDerivedFromDef(this.getExtendsRelationshipRef(), this.getName(), base);
        }
        //return p.measure(bodyCode);
    }
    constructResolvedTraits(rtsb) {
        //let bodyCode = () =>
        {
            this.constructResolvedTraitsDef(this.getExtendsRelationshipRef(), rtsb);
            rtsb.cleanUp();
        }
        //return p.measure(bodyCode);
    }
    constructResolvedAttributes() {
        //let bodyCode = () =>
        {
            return null;
        }
        //return p.measure(bodyCode);
    }
}
exports.RelationshipImpl = RelationshipImpl;
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
//
//  datatypes
//
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
//  {DataTypeRef}
////////////////////////////////////////////////////////////////////////////////////////////////////
class DataTypeReferenceImpl extends cdmObjectRef {
    constructor(dataType, appliedTraits) {
        super(appliedTraits);
        //let bodyCode = () =>
        {
            this.objectType = cdmObjectType.dataTypeRef;
            this.dataType = dataType;
        }
        //return p.measure(bodyCode);
    }
    getObjectType() {
        //let bodyCode = () =>
        {
            return cdmObjectType.dataTypeRef;
        }
        //return p.measure(bodyCode);
    }
    getObjectRefType() {
        //let bodyCode = () =>
        {
            return cdmObjectType.unresolved;
        }
        //return p.measure(bodyCode);
    }
    copyData(stringRefs) {
        //let bodyCode = () =>
        {
            let castedToInterface = {
                dataTypeReference: this.dataType.copyData(stringRefs),
                appliedTraits: cdmObject.arraycopyData(this.appliedTraits, stringRefs)
            };
            return castedToInterface;
        }
        //return p.measure(bodyCode);
    }
    copy() {
        //let bodyCode = () =>
        {
            let copy = new DataTypeReferenceImpl(null, false);
            copy.dataType = this.dataType.copy();
            this.copyRef(copy);
            return copy;
        }
        //return p.measure(bodyCode);
    }
    validate() {
        //let bodyCode = () =>
        {
            return this.dataType ? true : false;
        }
        //return p.measure(bodyCode);
    }
    getFriendlyFormat() {
        //let bodyCode = () =>
        {
            let ff = new friendlyFormatNode();
            ff.separator = " ";
            ff.addChild(this.dataType.getFriendlyFormat());
            this.getFriendlyFormatRef(ff);
            return ff;
        }
        //return p.measure(bodyCode);
    }
    static createClass(object) {
        //let bodyCode = () =>
        {
            let dataType = cdmObject.createStringOrImpl(object.dataTypeReference, cdmObjectType.dataTypeRef, DataTypeImpl.createClass);
            let c = new DataTypeReferenceImpl(dataType, object.appliedTraits);
            c.appliedTraits = cdmObject.createTraitReferenceArray(object.appliedTraits);
            return c;
        }
        //return p.measure(bodyCode);
    }
    getObjectDef() {
        //let bodyCode = () =>
        {
            return this.dataType.getObjectDef();
        }
        //return p.measure(bodyCode);
    }
    setObjectDef(def) {
        //let bodyCode = () =>
        {
            this.dataType = def;
            return this.dataType.getObjectDef();
        }
        //return p.measure(bodyCode);
    }
    visit(userData, pathRoot, preChildren, postChildren, statusRpt) {
        //let bodyCode = () =>
        {
            let path = this.declaredPath;
            if (!path) {
                path = pathRoot;
                if (this.dataType.objectType === cdmObjectType.stringConstant)
                    path = pathRoot + this.dataType.constantValue;
                else
                    path = pathRoot;
                this.declaredPath = path;
            }
            //trackVisits(path);
            if (preChildren && preChildren(userData, this, path, statusRpt))
                return false;
            if (this.dataType)
                if (this.dataType.visit(userData, path, preChildren, postChildren, statusRpt))
                    return true;
            if (this.visitRef(userData, path, preChildren, postChildren, statusRpt))
                return true;
            if (postChildren && postChildren(userData, this, path, statusRpt))
                return true;
            return false;
        }
        //return p.measure(bodyCode);
    }
}
exports.DataTypeReferenceImpl = DataTypeReferenceImpl;
////////////////////////////////////////////////////////////////////////////////////////////////////
//  {DataTypeDef}
////////////////////////////////////////////////////////////////////////////////////////////////////
class DataTypeImpl extends cdmObjectDef {
    constructor(dataTypeName, extendsDataType, exhibitsTraits = false) {
        super(exhibitsTraits);
        //let bodyCode = () =>
        {
            this.objectType = cdmObjectType.dataTypeDef;
            this.dataTypeName = dataTypeName;
            this.extendsDataType = extendsDataType;
        }
        //return p.measure(bodyCode);
    }
    getObjectType() {
        //let bodyCode = () =>
        {
            return cdmObjectType.dataTypeDef;
        }
        //return p.measure(bodyCode);
    }
    getObjectRefType() {
        //let bodyCode = () =>
        {
            return cdmObjectType.dataTypeRef;
        }
        //return p.measure(bodyCode);
    }
    copyData(stringRefs) {
        //let bodyCode = () =>
        {
            let castedToInterface = {
                explanation: this.explanation,
                dataTypeName: this.dataTypeName,
                extendsDataType: this.extendsDataType ? this.extendsDataType.copyData(stringRefs) : undefined,
                exhibitsTraits: cdmObject.arraycopyData(this.exhibitsTraits, stringRefs)
            };
            return castedToInterface;
        }
        //return p.measure(bodyCode);
    }
    copy() {
        //let bodyCode = () =>
        {
            let copy = new DataTypeImpl(this.dataTypeName, null, false);
            copy.extendsDataType = this.extendsDataType ? this.extendsDataType.copy() : undefined;
            this.copyDef(copy);
            return copy;
        }
        //return p.measure(bodyCode);
    }
    validate() {
        //let bodyCode = () =>
        {
            return this.dataTypeName ? true : false;
        }
        //return p.measure(bodyCode);
    }
    getFriendlyFormat() {
        //let bodyCode = () =>
        {
            let ff = new friendlyFormatNode();
            ff.separator = " ";
            ff.addChildString("dataType");
            ff.addChildString(this.dataTypeName);
            if (this.extendsDataType) {
                ff.addChildString("extends");
                ff.addChild(this.extendsDataType.getFriendlyFormat());
            }
            this.getFriendlyFormatDef(ff);
            return ff;
        }
        //return p.measure(bodyCode);
    }
    static createClass(object) {
        //let bodyCode = () =>
        {
            let extendsDataType;
            extendsDataType = cdmObject.createDataTypeReference(object.extendsDataType);
            let c = new DataTypeImpl(object.dataTypeName, extendsDataType, object.exhibitsTraits);
            if (object.explanation)
                c.explanation = object.explanation;
            c.exhibitsTraits = cdmObject.createTraitReferenceArray(object.exhibitsTraits);
            return c;
        }
        //return p.measure(bodyCode);
    }
    getName() {
        //let bodyCode = () =>
        {
            return this.dataTypeName;
        }
        //return p.measure(bodyCode);
    }
    getExtendsDataTypeRef() {
        //let bodyCode = () =>
        {
            return this.extendsDataType;
        }
        //return p.measure(bodyCode);
    }
    visit(userData, pathRoot, preChildren, postChildren, statusRpt) {
        //let bodyCode = () =>
        {
            let path = this.declaredPath;
            if (!path) {
                path = pathRoot + this.dataTypeName;
                this.declaredPath = path;
            }
            //trackVisits(path);
            if (preChildren && preChildren(userData, this, path, statusRpt))
                return false;
            if (this.extendsDataType)
                if (this.extendsDataType.visit(userData, path + "/extendsDataType/", preChildren, postChildren, statusRpt))
                    return true;
            if (this.visitDef(userData, path, preChildren, postChildren, statusRpt))
                return true;
            if (postChildren && postChildren(userData, this, path, statusRpt))
                return true;
            return false;
        }
        //return p.measure(bodyCode);
    }
    isDerivedFrom(base) {
        //let bodyCode = () =>
        {
            return this.isDerivedFromDef(this.getExtendsDataTypeRef(), this.getName(), base);
        }
        //return p.measure(bodyCode);
    }
    constructResolvedTraits(rtsb) {
        //let bodyCode = () =>
        {
            this.constructResolvedTraitsDef(this.getExtendsDataTypeRef(), rtsb);
            rtsb.cleanUp();
        }
        //return p.measure(bodyCode);
    }
    constructResolvedAttributes() {
        //let bodyCode = () =>
        {
            return null;
        }
        //return p.measure(bodyCode);
    }
}
exports.DataTypeImpl = DataTypeImpl;
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
//
//  attributes
//
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
//  {AttributeDef}
////////////////////////////////////////////////////////////////////////////////////////////////////
class AttributeImpl extends cdmObjectDef {
    constructor(appliedTraits = false) {
        super();
        //let bodyCode = () =>
        {
            if (appliedTraits)
                this.appliedTraits = new Array();
        }
        //return p.measure(bodyCode);
    }
    copyAtt(copy) {
        //let bodyCode = () =>
        {
            copy.relationship = this.relationship ? this.relationship.copy() : undefined;
            copy.appliedTraits = cdmObject.arrayCopy(this.appliedTraits);
            this.copyDef(copy);
            return copy;
        }
        //return p.measure(bodyCode);
    }
    setObjectDef(def) {
        //let bodyCode = () =>
        {
            throw Error("not a ref");
        }
        //return p.measure(bodyCode);
    }
    getRelationshipRef() {
        //let bodyCode = () =>
        {
            return this.relationship;
        }
        //return p.measure(bodyCode);
    }
    setRelationshipRef(relRef) {
        //let bodyCode = () =>
        {
            this.relationship = relRef;
            return this.relationship;
        }
        //return p.measure(bodyCode);
    }
    getAppliedTraitRefs() {
        //let bodyCode = () =>
        {
            return this.appliedTraits;
        }
        //return p.measure(bodyCode);
    }
    addAppliedTrait(traitDef) {
        //let bodyCode = () =>
        {
            if (!traitDef)
                return null;
            this.clearTraitCache();
            if (!this.appliedTraits)
                this.appliedTraits = new Array();
            return addTraitRef(this.appliedTraits, traitDef);
        }
        //return p.measure(bodyCode);
    }
    visitAtt(userData, pathRoot, preChildren, postChildren, statusRpt) {
        //let bodyCode = () =>
        {
            if (this.relationship)
                if (this.relationship.visit(userData, pathRoot + "/relationship/", preChildren, postChildren, statusRpt))
                    return true;
            if (this.appliedTraits)
                if (cdmObject.visitArray(this.appliedTraits, userData, pathRoot + "/appliedTraits/", preChildren, postChildren, statusRpt))
                    return true;
            if (this.visitDef(userData, pathRoot, preChildren, postChildren, statusRpt))
                return true;
            return false;
        }
        //return p.measure(bodyCode);
    }
    addResolvedTraitsApplied(rtsb) {
        //let bodyCode = () =>
        {
            let set = rtsb.set;
            let addAppliedTraits = (ats) => {
                if (ats) {
                    let l = ats.length;
                    for (let i = 0; i < l; i++) {
                        rtsb.mergeTraits(ats[i].getResolvedTraits(cdmTraitSet.all));
                    }
                }
            };
            addAppliedTraits(this.appliedTraits);
            // any applied on use
            return rtsb.rts;
        }
        //return p.measure(bodyCode);
    }
    removedTraitDef(def) {
        //let bodyCode = () =>
        {
            this.clearTraitCache();
            let traitName = def.getName();
            if (this.appliedTraits) {
                let iRemove = 0;
                for (iRemove = 0; iRemove < this.appliedTraits.length; iRemove++) {
                    const tr = this.appliedTraits[iRemove];
                    if (tr.getObjectDef().getName() == traitName)
                        break;
                }
                if (iRemove < this.appliedTraits.length) {
                    this.appliedTraits.splice(iRemove, 1);
                    return;
                }
            }
        }
        //return p.measure(bodyCode);
    }
}
exports.AttributeImpl = AttributeImpl;
////////////////////////////////////////////////////////////////////////////////////////////////////
//  {TypeAttributeDef}
////////////////////////////////////////////////////////////////////////////////////////////////////
class TypeAttributeImpl extends AttributeImpl {
    constructor(name, appliedTraits = false) {
        super(appliedTraits);
        //let bodyCode = () =>
        {
            this.objectType = cdmObjectType.typeAttributeDef;
            this.name = name;
        }
        //return p.measure(bodyCode);
    }
    getObjectType() {
        //let bodyCode = () =>
        {
            return cdmObjectType.typeAttributeDef;
        }
        //return p.measure(bodyCode);
    }
    getObjectRefType() {
        return cdmObjectType.unresolved;
    }
    copyData(stringRefs) {
        //let bodyCode = () =>
        {
            let castedToInterface = {
                explanation: this.explanation,
                name: this.name,
                relationship: this.relationship ? this.relationship.copyData(stringRefs) : undefined,
                dataType: this.dataType ? this.dataType.copyData(stringRefs) : undefined,
                appliedTraits: cdmObject.arraycopyData(this.appliedTraits, stringRefs)
            };
            return castedToInterface;
        }
        //return p.measure(bodyCode);
    }
    copy() {
        //let bodyCode = () =>
        {
            let copy = new TypeAttributeImpl(this.name, false);
            copy.dataType = this.dataType ? this.dataType.copy() : undefined;
            this.copyAtt(copy);
            return copy;
        }
        //return p.measure(bodyCode);
    }
    validate() {
        //let bodyCode = () =>
        {
            return this.relationship && this.name && this.dataType ? true : false;
        }
        //return p.measure(bodyCode);
    }
    getFriendlyFormat() {
        //let bodyCode = () =>
        {
            let ff = new friendlyFormatNode();
            ff.separator = " ";
            ff.addComment(this.explanation);
            ff.addChild(this.relationship.getFriendlyFormat());
            ff.addChild(this.dataType.getFriendlyFormat());
            ff.addChildString(this.name);
            if (this.appliedTraits && this.appliedTraits.length) {
                let ffSub = new friendlyFormatNode();
                ffSub.separator = ", ";
                ffSub.starter = "[";
                ffSub.terminator = "]";
                ffSub.lineWrap = true;
                cdmObject.arrayGetFriendlyFormat(ffSub, this.appliedTraits);
                ff.addChild(ffSub);
            }
            return ff;
        }
        //return p.measure(bodyCode);
    }
    static createClass(object) {
        //let bodyCode = () =>
        {
            let c = new TypeAttributeImpl(object.name, object.appliedTraits);
            if (object.explanation)
                c.explanation = object.explanation;
            c.relationship = cdmObject.createRelationshipReference(object.relationship);
            c.dataType = cdmObject.createDataTypeReference(object.dataType);
            c.appliedTraits = cdmObject.createTraitReferenceArray(object.appliedTraits);
            return c;
        }
        //return p.measure(bodyCode);
    }
    isDerivedFrom(base) {
        //let bodyCode = () =>
        {
            return false;
        }
        //return p.measure(bodyCode);
    }
    getName() {
        //let bodyCode = () =>
        {
            return this.name;
        }
        //return p.measure(bodyCode);
    }
    getDataTypeRef() {
        //let bodyCode = () =>
        {
            return this.dataType;
        }
        //return p.measure(bodyCode);
    }
    setDataTypeRef(dataType) {
        //let bodyCode = () =>
        {
            this.dataType = dataType;
            return this.dataType;
        }
        //return p.measure(bodyCode);
    }
    visit(userData, pathRoot, preChildren, postChildren, statusRpt) {
        //let bodyCode = () =>
        {
            let path = this.declaredPath;
            if (!path) {
                path = pathRoot + this.name;
                this.declaredPath = path;
            }
            //trackVisits(path);
            if (preChildren && preChildren(userData, this, path, statusRpt))
                return false;
            if (this.dataType)
                if (this.dataType.visit(userData, path + "/dataType/", preChildren, postChildren, statusRpt))
                    return true;
            if (this.visitAtt(userData, path, preChildren, postChildren, statusRpt))
                return true;
            if (postChildren && postChildren(userData, this, path, statusRpt))
                return true;
            return false;
        }
        //return p.measure(bodyCode);
    }
    constructResolvedTraits(rtsb) {
        //let bodyCode = () =>
        {
            let set = rtsb.set;
            if (set == cdmTraitSet.inheritedOnly || set == cdmTraitSet.elevatedOnly) {
                if (set == cdmTraitSet.inheritedOnly)
                    set = cdmTraitSet.all;
                // // get from datatype
                if (this.dataType)
                    rtsb.takeReference(this.getDataTypeRef().getResolvedTraits(set));
                // // get from relationship
                if (this.relationship)
                    rtsb.mergeTraits(this.getRelationshipRef().getResolvedTraits(set));
            }
            if (set == cdmTraitSet.appliedOnly || set == cdmTraitSet.elevatedOnly) {
                if (set == cdmTraitSet.appliedOnly)
                    set = cdmTraitSet.all;
                this.addResolvedTraitsApplied(rtsb);
            }
            rtsb.cleanUp();
        }
        //return p.measure(bodyCode);
    }
    constructResolvedAttributes() {
        //let bodyCode = () =>
        {
            // find and cache the complete set of attributes
            // attributes definitions originate from and then get modified by subsequent re-defintions from (in this order):
            // the datatype used as an attribute, traits applied to that datatype,
            // the relationship of the attribute, any traits applied to the attribute.
            let rasb = new ResolvedAttributeSetBuilder();
            // add this attribute to the set
            // make a new one and apply any traits
            let newAtt = new ResolvedAttribute(this);
            rasb.ownOne(newAtt);
            rasb.applyTraits(this.getResolvedTraits(cdmTraitSet.all));
            // from the traits of the datatype, relationship and applied here, see if new attributes get generated
            rasb.mergeTraitAttributes(this.getResolvedTraits(cdmTraitSet.all));
            return rasb;
        }
        //return p.measure(bodyCode);
    }
    getResolvedEntityReferences() {
        //let bodyCode = () =>
        {
            return null;
        }
        //return p.measure(bodyCode);
    }
}
exports.TypeAttributeImpl = TypeAttributeImpl;
////////////////////////////////////////////////////////////////////////////////////////////////////
//  {EntityAttributeDef}
////////////////////////////////////////////////////////////////////////////////////////////////////
class EntityAttributeImpl extends AttributeImpl {
    constructor(appliedTraits = false) {
        super(appliedTraits);
        //let bodyCode = () =>
        {
            this.objectType = cdmObjectType.entityAttributeDef;
        }
        //return p.measure(bodyCode);
    }
    getObjectType() {
        //let bodyCode = () =>
        {
            return cdmObjectType.typeAttributeDef;
        }
        //return p.measure(bodyCode);
    }
    getObjectRefType() {
        //let bodyCode = () =>
        {
            return cdmObjectType.unresolved;
        }
        //return p.measure(bodyCode);
    }
    isDerivedFrom(base) {
        //let bodyCode = () =>
        {
            return false;
        }
        //return p.measure(bodyCode);
    }
    copyData(stringRefs) {
        //let bodyCode = () =>
        {
            let entity;
            if (this.entity instanceof Array)
                entity = cdmObject.arraycopyData(this.entity, stringRefs);
            else
                entity = this.entity ? this.entity.copyData(stringRefs) : undefined;
            let castedToInterface = {
                explanation: this.explanation,
                relationship: this.relationship ? this.relationship.copyData(stringRefs) : undefined,
                entity: entity,
                appliedTraits: cdmObject.arraycopyData(this.appliedTraits, stringRefs)
            };
            return castedToInterface;
        }
        //return p.measure(bodyCode);
    }
    copy() {
        //let bodyCode = () =>
        {
            let copy = new EntityAttributeImpl(false);
            if (this.entity instanceof Array)
                copy.entity = cdmObject.arrayCopy(this.entity);
            else
                copy.entity = this.entity.copy();
            this.copyAtt(copy);
            return copy;
        }
        //return p.measure(bodyCode);
    }
    validate() {
        //let bodyCode = () =>
        {
            return this.relationship && this.entity ? true : false;
        }
        //return p.measure(bodyCode);
    }
    getFriendlyFormat() {
        //let bodyCode = () =>
        {
            let ff = new friendlyFormatNode();
            ff.separator = " ";
            ff.lineWrap = true;
            ff.addComment(this.explanation);
            ff.addChild(this.relationship.getFriendlyFormat());
            let ffSub = new friendlyFormatNode();
            ffSub.separator = ", ";
            ffSub.starter = "{";
            ffSub.terminator = "}";
            if (this.entity instanceof Array) {
                cdmObject.arrayGetFriendlyFormat(ffSub, this.entity);
                ffSub.forceWrap = true;
            }
            else {
                ffSub.addChild(this.entity.getFriendlyFormat());
                ffSub.forceWrap = false;
            }
            ff.addChild(ffSub);
            if (this.appliedTraits && this.appliedTraits.length) {
                let ffSub = new friendlyFormatNode();
                ffSub.separator = ", ";
                ffSub.starter = "[";
                ffSub.terminator = "]";
                ffSub.lineWrap = true;
                cdmObject.arrayGetFriendlyFormat(ff, this.appliedTraits);
                ff.addChild(ffSub);
            }
            return ff;
        }
        //return p.measure(bodyCode);
    }
    static createClass(object) {
        //let bodyCode = () =>
        {
            let c = new EntityAttributeImpl(object.appliedTraits);
            if (object.explanation)
                c.explanation = object.explanation;
            if (typeof object.entity === "string")
                c.entity = new StringConstant(cdmObjectType.entityRef, object.entity);
            else {
                if (object.entity instanceof Array) {
                    c.entity = new Array();
                    object.entity.forEach(e => {
                        c.entity.push(cdmObject.createEntityReference(e));
                    });
                }
                else {
                    c.entity = EntityReferenceImpl.createClass(object.entity);
                }
            }
            c.relationship = object.relationship ? cdmObject.createRelationshipReference(object.relationship) : undefined;
            c.appliedTraits = cdmObject.createTraitReferenceArray(object.appliedTraits);
            return c;
        }
        //return p.measure(bodyCode);
    }
    getName() {
        //let bodyCode = () =>
        {
            return "(unspecified)";
        }
        //return p.measure(bodyCode);
    }
    getEntityRefIsArray() {
        //let bodyCode = () =>
        {
            return this.entity instanceof Array;
        }
        //return p.measure(bodyCode);
    }
    getEntityRef() {
        //let bodyCode = () =>
        {
            return this.entity;
        }
        //return p.measure(bodyCode);
    }
    setEntityRef(entRef) {
        //let bodyCode = () =>
        {
            this.entity = entRef;
            return this.entity;
        }
        //return p.measure(bodyCode);
    }
    visit(userData, pathRoot, preChildren, postChildren, statusRpt) {
        //let bodyCode = () =>
        {
            let path = this.declaredPath;
            if (!path) {
                path = pathRoot + "(unspecified)";
                this.declaredPath = path;
            }
            //trackVisits(path);
            if (preChildren && preChildren(userData, this, path, statusRpt))
                return false;
            if (this.entity instanceof Array) {
                if (cdmObject.visitArray(this.entity, userData, path + "/entity/", preChildren, postChildren, statusRpt))
                    return true;
            }
            else {
                if (this.entity)
                    if (this.entity.visit(userData, path + "/entity/", preChildren, postChildren, statusRpt))
                        return true;
            }
            if (this.visitAtt(userData, path, preChildren, postChildren, statusRpt))
                return true;
            if (postChildren && postChildren(userData, this, path, statusRpt))
                return true;
            return false;
        }
        //return p.measure(bodyCode);
    }
    constructResolvedTraits(rtsb) {
        //let bodyCode = () =>
        {
            let set = rtsb.set;
            if (set == cdmTraitSet.inheritedOnly || set == cdmTraitSet.elevatedOnly) {
                if (set == cdmTraitSet.inheritedOnly)
                    set = cdmTraitSet.all;
                // // get from relationship
                if (this.relationship)
                    rtsb.takeReference(this.getRelationshipRef().getResolvedTraits(set));
            }
            if (set == cdmTraitSet.elevatedOnly) {
                // get from entities unless this is a ref
                let relRts = this.getRelationshipRef().getResolvedTraits(cdmTraitSet.all);
                if (!relRts || !relRts.find("does.referenceEntity")) {
                    if (this.getEntityRefIsArray()) {
                        this.entity.forEach(er => {
                            rtsb.mergeTraits(er.getResolvedTraits(cdmTraitSet.elevatedOnly));
                        });
                    }
                    else
                        rtsb.mergeTraits(this.entity.getResolvedTraits(cdmTraitSet.elevatedOnly));
                }
            }
            if (set == cdmTraitSet.appliedOnly || set == cdmTraitSet.elevatedOnly) {
                if (set == cdmTraitSet.appliedOnly)
                    set = cdmTraitSet.all;
                this.addResolvedTraitsApplied(rtsb);
            }
            rtsb.cleanUp();
        }
        //return p.measure(bodyCode);
    }
    constructResolvedAttributes() {
        //let bodyCode = () =>
        {
            // find and cache the complete set of attributes
            // attributes definitions originate from and then get modified by subsequent re-defintions from (in this order):
            // the entity used as an attribute, traits applied to that entity,
            // the relationship of the attribute, any traits applied to the attribute.
            let rasb = new ResolvedAttributeSetBuilder();
            // complete cheating but is faster. this relationship will remove all of the attributes that get collected here, so dumb and slow to go get them
            let relRts = this.getRelationshipRef().getResolvedTraits(cdmTraitSet.all);
            if (!relRts || !relRts.find("does.referenceEntity")) {
                if (this.getEntityRefIsArray()) {
                    this.entity.forEach(er => {
                        rasb.mergeAttributes(er.getResolvedAttributes());
                    });
                }
                else {
                    rasb.mergeAttributes(this.entity.getResolvedAttributes());
                }
            }
            rasb.applyTraits(this.getResolvedTraits(cdmTraitSet.all));
            // from the traits of relationship and applied here, see if new attributes get generated
            rasb.mergeTraitAttributes(this.getResolvedTraits(cdmTraitSet.all));
            return rasb;
        }
        //return p.measure(bodyCode);
    }
    getResolvedEntityReferences() {
        //let bodyCode = () =>
        {
            let relRts = this.getRelationshipRef().getResolvedTraits(cdmTraitSet.all);
            if (relRts && relRts.find("does.referenceEntity")) {
                // only place this is used, so logic here instead of encapsulated. 
                // make a set and the one ref it will hold
                let rers = new ResolvedEntityReferenceSet();
                let rer = new ResolvedEntityReference();
                // referencing attribute(s) come from this attribute
                rer.referencing.rasb.mergeAttributes(this.getResolvedAttributes());
                let resolveSide = (entRef) => {
                    let sideOther = new ResolvedEntityReferenceSide();
                    if (entRef) {
                        // reference to the other entity, hard part is the attribue name.
                        // by convention, this is held in a trait that identifies the key
                        sideOther.entity = entRef.getObjectDef();
                        let otherAttribute;
                        let t = entRef.getResolvedTraits().find("is.identifiedBy");
                        if (t && t.parameterValues && t.parameterValues.length) {
                            let otherRef = (t.parameterValues.getParameterValue("attribute").value);
                            if (otherRef) {
                                otherAttribute = otherRef.getObjectDef();
                                if (otherAttribute) {
                                    if (!otherAttribute.getName)
                                        otherAttribute.getName();
                                    sideOther.rasb.ownOne(sideOther.entity.getResolvedAttributes().get(otherAttribute.getName()));
                                }
                            }
                        }
                    }
                    return sideOther;
                };
                // either several or one entity
                if (this.getEntityRefIsArray()) {
                    this.entity.forEach(er => {
                        rer.referenced.push(resolveSide(er));
                    });
                }
                else {
                    rer.referenced.push(resolveSide(this.entity));
                }
                rers.set.push(rer);
                return rers;
            }
            return null;
        }
        //return p.measure(bodyCode);
    }
}
exports.EntityAttributeImpl = EntityAttributeImpl;
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
//
//  attribute groups
//
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
//  {AttributeGroupRef}
////////////////////////////////////////////////////////////////////////////////////////////////////
class AttributeGroupReferenceImpl extends cdmObjectRef {
    constructor(attributeGroup) {
        super(false);
        //let bodyCode = () =>
        {
            this.objectType = cdmObjectType.attributeGroupRef;
            this.attributeGroup = attributeGroup;
        }
        //return p.measure(bodyCode);
    }
    getObjectType() {
        //let bodyCode = () =>
        {
            return cdmObjectType.attributeGroupRef;
        }
        //return p.measure(bodyCode);
    }
    getObjectRefType() {
        //let bodyCode = () =>
        {
            return cdmObjectType.unresolved;
        }
        //return p.measure(bodyCode);
    }
    copyData(stringRefs) {
        //let bodyCode = () =>
        {
            let castedToInterface = {
                attributeGroupReference: this.attributeGroup.copyData(stringRefs)
            };
            return castedToInterface;
        }
        //return p.measure(bodyCode);
    }
    copy() {
        //let bodyCode = () =>
        {
            let copy = new AttributeGroupReferenceImpl(null);
            copy.attributeGroup = this.attributeGroup.copy();
            this.copyRef(copy);
            return copy;
        }
        //return p.measure(bodyCode);
    }
    validate() {
        //let bodyCode = () =>
        {
            return this.attributeGroup ? true : false;
        }
        //return p.measure(bodyCode);
    }
    getFriendlyFormat() {
        //let bodyCode = () =>
        {
            let ff = new friendlyFormatNode();
            ff.separator = " ";
            ff.addChild(this.attributeGroup.getFriendlyFormat());
            this.getFriendlyFormatRef(ff);
            return ff;
        }
        //return p.measure(bodyCode);
    }
    static createClass(object) {
        //let bodyCode = () =>
        {
            let attributeGroup = cdmObject.createStringOrImpl(object.attributeGroupReference, cdmObjectType.attributeGroupRef, AttributeGroupImpl.createClass);
            let c = new AttributeGroupReferenceImpl(attributeGroup);
            return c;
        }
        //return p.measure(bodyCode);
    }
    getObjectDef() {
        //let bodyCode = () =>
        {
            return this.attributeGroup.getObjectDef();
        }
        //return p.measure(bodyCode);
    }
    setObjectDef(def) {
        //let bodyCode = () =>
        {
            this.attributeGroup = def;
            return this.attributeGroup.getObjectDef();
        }
        //return p.measure(bodyCode);
    }
    getAppliedTraitRefs() {
        //let bodyCode = () =>
        {
            return null;
        }
        //return p.measure(bodyCode);
    }
    visit(userData, pathRoot, preChildren, postChildren, statusRpt) {
        //let bodyCode = () =>
        {
            let path = this.declaredPath;
            if (!path) {
                if (this.attributeGroup.objectType === cdmObjectType.stringConstant)
                    path = pathRoot + this.attributeGroup.constantValue;
                else
                    path = pathRoot;
                this.declaredPath = path;
            }
            //trackVisits(path);
            if (preChildren && preChildren(userData, this, path, statusRpt))
                return false;
            if (this.attributeGroup)
                if (this.attributeGroup.visit(userData, path, preChildren, postChildren, statusRpt))
                    return true;
            if (postChildren && postChildren(userData, this, path, statusRpt))
                return true;
            return false;
        }
        //return p.measure(bodyCode);
    }
    getResolvedEntityReferences() {
        //let bodyCode = () =>
        {
            if (this.attributeGroup)
                return this.attributeGroup.getResolvedEntityReferences();
            return null;
        }
        //return p.measure(bodyCode);
    }
}
exports.AttributeGroupReferenceImpl = AttributeGroupReferenceImpl;
////////////////////////////////////////////////////////////////////////////////////////////////////
//  {AttributeGroupDef}
////////////////////////////////////////////////////////////////////////////////////////////////////
class AttributeGroupImpl extends cdmObjectDef {
    constructor(attributeGroupName) {
        super();
        //let bodyCode = () =>
        {
            this.objectType = cdmObjectType.attributeGroupDef;
            this.attributeGroupName = attributeGroupName;
            this.members = new Array();
        }
        //return p.measure(bodyCode);
    }
    getObjectType() {
        //let bodyCode = () =>
        {
            return cdmObjectType.attributeGroupDef;
        }
        //return p.measure(bodyCode);
    }
    getObjectRefType() {
        //let bodyCode = () =>
        {
            return cdmObjectType.attributeGroupRef;
        }
        //return p.measure(bodyCode);
    }
    isDerivedFrom(base) {
        //let bodyCode = () =>
        {
            return false;
        }
        //return p.measure(bodyCode);
    }
    copyData(stringRefs) {
        //let bodyCode = () =>
        {
            let castedToInterface = {
                explanation: this.explanation,
                attributeGroupName: this.attributeGroupName,
                exhibitsTraits: cdmObject.arraycopyData(this.exhibitsTraits, stringRefs),
                members: cdmObject.arraycopyData(this.members, stringRefs)
            };
            return castedToInterface;
        }
        //return p.measure(bodyCode);
    }
    copy() {
        //let bodyCode = () =>
        {
            let copy = new AttributeGroupImpl(this.attributeGroupName);
            copy.members = cdmObject.arrayCopy(this.members);
            this.copyDef(copy);
            return copy;
        }
        //return p.measure(bodyCode);
    }
    validate() {
        //let bodyCode = () =>
        {
            return this.attributeGroupName ? true : false;
        }
        //return p.measure(bodyCode);
    }
    getFriendlyFormat() {
        //let bodyCode = () =>
        {
            let ff = new friendlyFormatNode();
            ff.separator = " ";
            ff.addChildString("attributeGroup");
            ff.addChildString(this.attributeGroupName);
            this.getFriendlyFormatDef(ff);
            let ffSub = new friendlyFormatNode();
            //ffSub.forceWrap = true;
            ffSub.verticalMode = true;
            ffSub.bracketEmpty = true;
            ffSub.indentChildren = true;
            ffSub.separator = ";\n";
            ffSub.starter = "{";
            ffSub.terminator = "}";
            cdmObject.arrayGetFriendlyFormat(ffSub, this.members);
            ff.addChild(ffSub);
            return ff;
        }
        //return p.measure(bodyCode);
    }
    static createClass(object) {
        //let bodyCode = () =>
        {
            let c = new AttributeGroupImpl(object.attributeGroupName);
            if (object.explanation)
                c.explanation = object.explanation;
            c.members = cdmObject.createAttributeArray(object.members);
            c.exhibitsTraits = cdmObject.createTraitReferenceArray(object.exhibitsTraits);
            return c;
        }
        //return p.measure(bodyCode);
    }
    getName() {
        //let bodyCode = () =>
        {
            return this.attributeGroupName;
        }
        //return p.measure(bodyCode);
    }
    getMembersAttributeDefs() {
        //let bodyCode = () =>
        {
            return this.members;
        }
        //return p.measure(bodyCode);
    }
    addMemberAttributeDef(attDef) {
        //let bodyCode = () =>
        {
            if (!this.members)
                this.members = new Array();
            this.members.push(attDef);
            return attDef;
        }
        //return p.measure(bodyCode);
    }
    visit(userData, pathRoot, preChildren, postChildren, statusRpt) {
        //let bodyCode = () =>
        {
            let path = this.declaredPath;
            if (!path) {
                path = pathRoot + this.attributeGroupName;
                this.declaredPath = path;
            }
            //trackVisits(path);
            if (preChildren && preChildren(userData, this, path, statusRpt))
                return false;
            if (this.members)
                if (cdmObject.visitArray(this.members, userData, path + "/members/", preChildren, postChildren, statusRpt))
                    return true;
            if (this.visitDef(userData, path, preChildren, postChildren, statusRpt))
                return true;
            if (postChildren && postChildren(userData, this, path, statusRpt))
                return true;
            return false;
        }
        //return p.measure(bodyCode);
    }
    constructResolvedAttributes() {
        //let bodyCode = () =>
        {
            let rasb = new ResolvedAttributeSetBuilder();
            if (this.members) {
                let l = this.members.length;
                for (let i = 0; i < l; i++) {
                    rasb.mergeAttributes(this.members[i].getResolvedAttributes());
                }
            }
            // things that need to go away
            rasb.removeRequestedAtts();
            return rasb;
        }
        //return p.measure(bodyCode);
    }
    getResolvedEntityReferences() {
        //let bodyCode = () =>
        {
            let rers = new ResolvedEntityReferenceSet();
            if (this.members) {
                let l = this.members.length;
                for (let i = 0; i < l; i++) {
                    rers.add(this.members[i].getResolvedEntityReferences());
                }
            }
            return rers;
        }
        //return p.measure(bodyCode);
    }
    constructResolvedTraits(rtsb) {
        //let bodyCode = () =>
        {
            let set = rtsb.set;
            if (set != cdmTraitSet.appliedOnly) {
                if (set == cdmTraitSet.inheritedOnly)
                    set = cdmTraitSet.all;
                this.constructResolvedTraitsDef(undefined, rtsb);
                if (set == cdmTraitSet.elevatedOnly) {
                    if (this.members) {
                        let l = this.members.length;
                        for (let i = 0; i < l; i++) {
                            let att = this.members[i];
                            let attOt = att.objectType;
                            rtsb.mergeTraits(att.getResolvedTraits(cdmTraitSet.elevatedOnly), (attOt == cdmObjectType.entityAttributeDef || attOt == cdmObjectType.typeAttributeDef) ? att : null);
                        }
                    }
                }
            }
            rtsb.cleanUp();
        }
        //return p.measure(bodyCode);
    }
}
exports.AttributeGroupImpl = AttributeGroupImpl;
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
//
//  the 'constant' entity
//
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
class ConstantEntityImpl extends cdmObjectDef {
    constructor() {
        super();
        //let bodyCode = () =>
        {
            this.objectType = cdmObjectType.constantEntityDef;
        }
        //return p.measure(bodyCode);
    }
    copyData(stringRefs) {
        //let bodyCode = () =>
        {
            let castedToInterface = {
                explanation: this.explanation,
                constantEntityName: this.constantEntityName,
                entityShape: this.entityShape ? this.entityShape.copyData(stringRefs) : undefined,
                constantValues: this.constantValues
            };
            return castedToInterface;
        }
        //return p.measure(bodyCode);
    }
    copy() {
        //let bodyCode = () =>
        {
            let copy = new ConstantEntityImpl();
            copy.constantEntityName = this.constantEntityName;
            copy.entityShape = this.entityShape.copy();
            copy.constantValues = this.constantValues; // is a deep copy needed? 
            this.copyDef(copy);
            return copy;
        }
        //return p.measure(bodyCode);
    }
    validate() {
        //let bodyCode = () =>
        {
            return this.entityShape ? true : false;
        }
        //return p.measure(bodyCode);
    }
    getFriendlyFormat() {
        //let bodyCode = () =>
        {
            let ff = new friendlyFormatNode();
            ff.separator = " ";
            ff.lineWrap = true;
            let ffDecl = new friendlyFormatNode();
            ff.addChild(ffDecl);
            ffDecl.separator = " ";
            ffDecl.addChildString("constant entity");
            ffDecl.addChildString(this.constantEntityName);
            ffDecl.addChildString("shaped like");
            ffDecl.addChild(this.entityShape.getFriendlyFormat());
            ffDecl.addChildString("contains");
            let ffTable = new friendlyFormatNode();
            ff.addChild(ffTable);
            ffTable.forceWrap = this.constantValues.length > 1;
            ffTable.bracketEmpty = true;
            ffTable.starter = "{";
            ffTable.terminator = "}";
            ffTable.separator = ",";
            for (let iRow = 0; iRow < this.constantValues.length; iRow++) {
                let ffRow = new friendlyFormatNode();
                ffRow.bracketEmpty = false;
                ffRow.starter = "{";
                ffRow.terminator = "}";
                ffRow.separator = ", ";
                const rowArray = this.constantValues[iRow];
                for (let iCol = 0; iCol < rowArray.length; iCol++) {
                    ffRow.addChildString(rowArray[iCol], true);
                }
                ffTable.addChild(ffRow);
            }
            return ff;
        }
        //return p.measure(bodyCode);
    }
    getObjectType() {
        //let bodyCode = () =>
        {
            return cdmObjectType.constantEntityDef;
        }
        //return p.measure(bodyCode);
    }
    getObjectRefType() {
        //let bodyCode = () =>
        {
            return cdmObjectType.entityRef;
        }
        //return p.measure(bodyCode);
    }
    isDerivedFrom(base) {
        //let bodyCode = () =>
        {
            return false;
        }
        //return p.measure(bodyCode);
    }
    static createClass(object) {
        //let bodyCode = () =>
        {
            let c = new ConstantEntityImpl();
            if (object.explanation)
                c.explanation = object.explanation;
            if (object.constantEntityName)
                c.constantEntityName = object.constantEntityName;
            c.constantValues = object.constantValues;
            c.entityShape = cdmObject.createStringOrImpl(object.entityShape, cdmObjectType.entityRef, EntityReferenceImpl.createClass);
            return c;
        }
        //return p.measure(bodyCode);
    }
    getName() {
        //let bodyCode = () =>
        {
            return this.constantEntityName;
        }
        //return p.measure(bodyCode);
    }
    getEntityShape() {
        //let bodyCode = () =>
        {
            return this.entityShape;
        }
        //return p.measure(bodyCode);
    }
    setEntityShape(shape) {
        //let bodyCode = () =>
        {
            this.entityShape = shape;
            return this.entityShape;
        }
        //return p.measure(bodyCode);
    }
    getConstantValues() {
        //let bodyCode = () =>
        {
            return this.constantValues;
        }
        //return p.measure(bodyCode);
    }
    setConstantValues(values) {
        //let bodyCode = () =>
        {
            this.constantValues = values;
            return this.constantValues;
        }
        //return p.measure(bodyCode);
    }
    visit(userData, pathRoot, preChildren, postChildren, statusRpt) {
        //let bodyCode = () =>
        {
            let path = this.declaredPath;
            if (!path) {
                path = pathRoot + (this.constantEntityName ? this.constantEntityName : "(unspecified)");
                this.declaredPath = path;
            }
            //trackVisits(path);
            if (preChildren && preChildren(userData, this, path, statusRpt))
                return false;
            if (this.entityShape)
                if (this.entityShape.visit(userData, path + "/entityShape/", preChildren, postChildren, statusRpt))
                    return true;
            if (postChildren && postChildren(userData, this, path, statusRpt))
                return true;
            return false;
        }
        //return p.measure(bodyCode);
    }
    constructResolvedTraits(rtsb) {
        //let bodyCode = () =>
        {
            return null;
        }
        //return p.measure(bodyCode);
    }
    constructResolvedAttributes() {
        //let bodyCode = () =>
        {
            let rasb = new ResolvedAttributeSetBuilder();
            if (this.entityShape)
                rasb.mergeAttributes(this.getEntityShape().getResolvedAttributes());
            // things that need to go away
            rasb.removeRequestedAtts();
            return rasb;
        }
        //return p.measure(bodyCode);
    }
    // the world's smallest complete query processor...
    lookupWhere(attReturn, attSearch, valueSearch) {
        //let bodyCode = () =>
        {
            // metadata library
            let ras = this.getResolvedAttributes();
            // query validation and binding
            let resultAtt = -1;
            let searchAtt = -1;
            let l = ras.set.length;
            for (let i = 0; i < l; i++) {
                let name = ras.set[i].resolvedName;
                if (name === attReturn)
                    resultAtt = i;
                if (name === attSearch)
                    searchAtt = i;
                if (resultAtt >= 0 && searchAtt >= 0)
                    break;
            }
            // rowset processing
            if (resultAtt >= 0 && searchAtt >= 0) {
                if (this.constantValues && this.constantValues.length) {
                    for (let i = 0; i < this.constantValues.length; i++) {
                        if (this.constantValues[i][searchAtt] == valueSearch)
                            return this.constantValues[i][resultAtt];
                    }
                }
            }
            return undefined;
        }
        //return p.measure(bodyCode);
    }
}
exports.ConstantEntityImpl = ConstantEntityImpl;
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
//
//  Entities
//
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
//  {EntityRef}
////////////////////////////////////////////////////////////////////////////////////////////////////
class EntityReferenceImpl extends cdmObjectRef {
    constructor(entityRef, appliedTraits) {
        super(appliedTraits);
        //let bodyCode = () =>
        {
            this.objectType = cdmObjectType.entityRef;
            this.entity = entityRef;
        }
        //return p.measure(bodyCode);
    }
    getObjectType() {
        //let bodyCode = () =>
        {
            return cdmObjectType.entityRef;
        }
        //return p.measure(bodyCode);
    }
    getObjectRefType() {
        //let bodyCode = () =>
        {
            return cdmObjectType.unresolved;
        }
        //return p.measure(bodyCode);
    }
    copyData(stringRefs) {
        //let bodyCode = () =>
        {
            let castedToInterface = {
                entityReference: this.entity.copyData(stringRefs),
                appliedTraits: cdmObject.arraycopyData(this.appliedTraits, stringRefs)
            };
            return castedToInterface;
        }
        //return p.measure(bodyCode);
    }
    copy() {
        //let bodyCode = () =>
        {
            let copy = new EntityReferenceImpl(null, false);
            copy.entity = this.entity.copy();
            this.copyRef(copy);
            return copy;
        }
        //return p.measure(bodyCode);
    }
    validate() {
        //let bodyCode = () =>
        {
            return this.entity ? true : false;
        }
        //return p.measure(bodyCode);
    }
    getFriendlyFormat() {
        //let bodyCode = () =>
        {
            let ff = new friendlyFormatNode();
            ff.separator = " ";
            ff.addChild(this.entity.getFriendlyFormat());
            this.getFriendlyFormatRef(ff);
            return ff;
        }
        //return p.measure(bodyCode);
    }
    static createClass(object) {
        //let bodyCode = () =>
        {
            let entity;
            if (object.entityReference.entityShape)
                entity = ConstantEntityImpl.createClass(object.entityReference);
            else
                entity = cdmObject.createStringOrImpl(object.entityReference, cdmObjectType.constantEntityRef, EntityImpl.createClass);
            let c = new EntityReferenceImpl(entity, object.appliedTraits);
            c.appliedTraits = cdmObject.createTraitReferenceArray(object.appliedTraits);
            return c;
        }
        //return p.measure(bodyCode);
    }
    getObjectDef() {
        //let bodyCode = () =>
        {
            return this.entity.getObjectDef();
        }
        //return p.measure(bodyCode);
    }
    setObjectDef(def) {
        //let bodyCode = () =>
        {
            this.entity = def;
            return this.entity.getObjectDef();
        }
        //return p.measure(bodyCode);
    }
    visit(userData, pathRoot, preChildren, postChildren, statusRpt) {
        //let bodyCode = () =>
        {
            let path = this.declaredPath;
            if (!path) {
                if (this.entity.objectType == cdmObjectType.stringConstant)
                    path = pathRoot + this.entity.constantValue;
                else if (this.entity.objectType == cdmObjectType.constantEntityDef)
                    path = pathRoot + "(constantEntity)";
                else
                    path = pathRoot;
                this.declaredPath = path;
            }
            //trackVisits(path);
            if (preChildren && preChildren(userData, this, path, statusRpt))
                return false;
            if (this.entity)
                if (this.entity.visit(userData, path, preChildren, postChildren, statusRpt))
                    return true;
            if (this.visitRef(userData, path, preChildren, postChildren, statusRpt))
                return true;
            if (postChildren && postChildren(userData, this, path, statusRpt))
                return true;
            return false;
        }
        //return p.measure(bodyCode);
    }
}
exports.EntityReferenceImpl = EntityReferenceImpl;
////////////////////////////////////////////////////////////////////////////////////////////////////
//  {EntityDef}
////////////////////////////////////////////////////////////////////////////////////////////////////
class EntityImpl extends cdmObjectDef {
    constructor(entityName, extendsEntity, exhibitsTraits = false, hasAttributes = false) {
        super(exhibitsTraits);
        //let bodyCode = () =>
        {
            this.objectType = cdmObjectType.entityDef;
            this.entityName = entityName;
            if (extendsEntity)
                this.extendsEntity = extendsEntity;
            if (hasAttributes)
                this.hasAttributes = new Array();
        }
        //return p.measure(bodyCode);
    }
    getObjectType() {
        //let bodyCode = () =>
        {
            return cdmObjectType.entityDef;
        }
        //return p.measure(bodyCode);
    }
    getObjectRefType() {
        //let bodyCode = () =>
        {
            return cdmObjectType.entityRef;
        }
        //return p.measure(bodyCode);
    }
    copyData(stringRefs) {
        //let bodyCode = () =>
        {
            let castedToInterface = {
                explanation: this.explanation,
                entityName: this.entityName,
                extendsEntity: this.extendsEntity ? this.extendsEntity.copyData(stringRefs) : undefined,
                exhibitsTraits: cdmObject.arraycopyData(this.exhibitsTraits, stringRefs),
                hasAttributes: cdmObject.arraycopyData(this.hasAttributes, stringRefs)
            };
            return castedToInterface;
        }
        //return p.measure(bodyCode);
    }
    copy() {
        //let bodyCode = () =>
        {
            let copy = new EntityImpl(this.entityName, null, false, false);
            copy.extendsEntity = copy.extendsEntity ? this.extendsEntity.copy() : undefined;
            copy.hasAttributes = cdmObject.arrayCopy(this.hasAttributes);
            this.copyDef(copy);
            return copy;
        }
        //return p.measure(bodyCode);
    }
    validate() {
        //let bodyCode = () =>
        {
            return this.entityName ? true : false;
        }
        //return p.measure(bodyCode);
    }
    getFriendlyFormat() {
        //let bodyCode = () =>
        {
            let ff = new friendlyFormatNode();
            ff.separator = " ";
            ff.separator = " ";
            ff.addChildString("entity");
            ff.addChildString(this.entityName);
            if (this.extendsEntity) {
                ff.addChildString("extends");
                ff.addChild(this.extendsEntity.getFriendlyFormat());
            }
            this.getFriendlyFormatDef(ff);
            let ffSub = new friendlyFormatNode();
            //ffSub.forceWrap = true;
            ffSub.verticalMode = true;
            ffSub.bracketEmpty = true;
            ffSub.indentChildren = true;
            ffSub.separator = ";\n";
            ffSub.starter = "{";
            ffSub.terminator = "}";
            cdmObject.arrayGetFriendlyFormat(ffSub, this.hasAttributes);
            ff.addChild(ffSub);
            return ff;
        }
        //return p.measure(bodyCode);
    }
    static createClass(object) {
        //let bodyCode = () =>
        {
            let extendsEntity;
            if (object.extendsEntity) {
                if (typeof object.extendsEntity === "string")
                    extendsEntity = new StringConstant(cdmObjectType.entityRef, object.extendsEntity);
                else
                    extendsEntity = EntityReferenceImpl.createClass(object.extendsEntity);
            }
            let c = new EntityImpl(object.entityName, extendsEntity, object.exhibitsTraits, object.hasAttributes);
            if (object.explanation)
                c.explanation = object.explanation;
            c.exhibitsTraits = cdmObject.createTraitReferenceArray(object.exhibitsTraits);
            c.hasAttributes = cdmObject.createAttributeArray(object.hasAttributes);
            return c;
        }
        //return p.measure(bodyCode);
    }
    getName() {
        //let bodyCode = () =>
        {
            return this.entityName;
        }
        //return p.measure(bodyCode);
    }
    getExtendsEntityRef() {
        //let bodyCode = () =>
        {
            return this.extendsEntity;
        }
        //return p.measure(bodyCode);
    }
    setExtendsEntityRef(ref) {
        //let bodyCode = () =>
        {
            this.extendsEntity = ref;
            return this.extendsEntity;
        }
        //return p.measure(bodyCode);
    }
    getHasAttributeDefs() {
        //let bodyCode = () =>
        {
            return this.hasAttributes;
        }
        //return p.measure(bodyCode);
    }
    addAttributeDef(attDef) {
        //let bodyCode = () =>
        {
            if (!this.hasAttributes)
                this.hasAttributes = new Array();
            this.hasAttributes.push(attDef);
            return attDef;
        }
        //return p.measure(bodyCode);
    }
    visit(userData, pathRoot, preChildren, postChildren, statusRpt) {
        //let bodyCode = () =>
        {
            let path = this.declaredPath;
            if (!path) {
                path = pathRoot + this.entityName;
                this.declaredPath = path;
            }
            //trackVisits(path);
            if (preChildren && preChildren(userData, this, path, statusRpt))
                return false;
            if (this.extendsEntity)
                if (this.extendsEntity.visit(userData, path + "/extendsEntity/", preChildren, postChildren, statusRpt))
                    return true;
            if (this.visitDef(userData, path, preChildren, postChildren, statusRpt))
                return true;
            if (this.hasAttributes)
                if (cdmObject.visitArray(this.hasAttributes, userData, path + "/hasAttributes/", preChildren, postChildren, statusRpt))
                    return true;
            if (postChildren && postChildren(userData, this, path, statusRpt))
                return true;
            return false;
        }
        //return p.measure(bodyCode);
    }
    isDerivedFrom(base) {
        //let bodyCode = () =>
        {
            return this.isDerivedFromDef(this.getExtendsEntityRef(), this.getName(), base);
        }
        //return p.measure(bodyCode);
    }
    constructResolvedTraits(rtsb) {
        //let bodyCode = () =>
        {
            let set = rtsb.set;
            if (set != cdmTraitSet.appliedOnly) {
                if (set == cdmTraitSet.inheritedOnly)
                    set = cdmTraitSet.all;
                this.constructResolvedTraitsDef(this.getExtendsEntityRef(), rtsb);
                if (set == cdmTraitSet.elevatedOnly) {
                    if (this.hasAttributes) {
                        let l = this.hasAttributes.length;
                        for (let i = 0; i < l; i++) {
                            let att = this.hasAttributes[i];
                            let attOt = att.objectType;
                            rtsb.mergeTraits(att.getResolvedTraits(cdmTraitSet.elevatedOnly), (attOt == cdmObjectType.entityAttributeDef || attOt == cdmObjectType.typeAttributeDef) ? att : null);
                        }
                    }
                }
            }
            rtsb.cleanUp();
        }
        //return p.measure(bodyCode);
    }
    getAttributePromise(forAtt) {
        //let bodyCode = () =>
        {
            if (!this.attributePromises)
                this.attributePromises = new Map();
            if (!this.attributePromises.has(forAtt))
                this.attributePromises.set(forAtt, new attributePromise(forAtt));
            return this.attributePromises.get(forAtt);
        }
        //return p.measure(bodyCode);
    }
    constructResolvedAttributes() {
        //let bodyCode = () =>
        {
            // find and cache the complete set of attributes
            // attributes definitions originate from and then get modified by subsequent re-defintions from (in this order):
            // an extended entity, traits applied to extended entity, exhibited traits of main entity, the (datatype or entity) used as an attribute, traits applied to that datatype or entity,
            // the relationsip of the attribute, the attribute definition itself and included attribute groups, any traits applied to the attribute.
            this.rasb = new ResolvedAttributeSetBuilder();
            if (this.extendsEntity)
                this.rasb.mergeAttributes(this.getExtendsEntityRef().getResolvedAttributes());
            this.rasb.markInherited();
            if (this.hasAttributes) {
                let l = this.hasAttributes.length;
                for (let i = 0; i < l; i++) {
                    this.rasb.mergeAttributes(this.hasAttributes[i].getResolvedAttributes());
                }
            }
            // things that need to go away
            this.rasb.removeRequestedAtts();
            // promises to keep?
            if (this.attributePromises) {
                this.attributePromises.forEach((v, k) => {
                    let ra = this.rasb.ras.get(v.requestedName);
                    if (ra)
                        v.resolvedAtt = ra.attribute;
                    else
                        throw new Error("couldn't resolve the attribute promise for " + v.requestedName);
                });
            }
            return this.rasb;
        }
        //return p.measure(bodyCode);
    }
    countInheritedAttributes() {
        //let bodyCode = () =>
        {
            // ensures that cache exits
            this.getResolvedAttributes();
            return this.rasb.inheritedMark;
        }
        //return p.measure(bodyCode);
    }
    getResolvedEntityReferences() {
        //let bodyCode = () =>
        {
            if (!this.entityRefSet) {
                this.entityRefSet = new ResolvedEntityReferenceSet();
                // get from any base class and then 'fix' those to point here instead.
                if (this.getExtendsEntityRef()) {
                    let inherited = this.getExtendsEntityRef().getObjectDef().getResolvedEntityReferences();
                    if (inherited) {
                        inherited.set.forEach((res) => {
                            res = res.copy();
                            res.referencing.entity = this;
                        });
                        this.entityRefSet.add(inherited);
                    }
                }
                if (this.hasAttributes) {
                    let l = this.hasAttributes.length;
                    for (let i = 0; i < l; i++) {
                        // if any refs come back from attributes, they don't know who we are, so they don't set the entity
                        let sub = this.hasAttributes[i].getResolvedEntityReferences();
                        if (sub) {
                            sub.set.forEach((res) => {
                                res.referencing.entity = this;
                            });
                        }
                        this.entityRefSet.add(sub);
                    }
                }
            }
            return this.entityRefSet;
        }
        //return p.measure(bodyCode);
    }
    getAttributesWithTraits(queryFor) {
        //let bodyCode = () =>
        {
            return this.getResolvedAttributes().getAttributesWithTraits(queryFor);
        }
        //return p.measure(bodyCode);
    }
}
exports.EntityImpl = EntityImpl;
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
//
//  documents and folders
//
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
//  {DocumentDef}
////////////////////////////////////////////////////////////////////////////////////////////////////
class Document extends cdmObject {
    constructor(name, hasImports = false) {
        super();
        //let bodyCode = () =>
        {
            this.objectType = cdmObjectType.documentDef;
            this.name = name;
            this.schemaVersion = "0.6.0";
            this.definitions = new Array();
            if (hasImports)
                this.imports = new Array();
        }
        //return p.measure(bodyCode);
    }
    getObjectType() {
        //let bodyCode = () =>
        {
            return cdmObjectType.documentDef;
        }
        //return p.measure(bodyCode);
    }
    getObjectRefType() {
        //let bodyCode = () =>
        {
            return cdmObjectType.unresolved;
        }
        //return p.measure(bodyCode);
    }
    getObjectDef() {
        return null;
    }
    copyData(stringRefs) {
        //let bodyCode = () =>
        {
            let castedToInterface = {
                schema: this.schema,
                schemaVersion: this.schemaVersion,
                imports: cdmObject.arraycopyData(this.imports, stringRefs),
                definitions: cdmObject.arraycopyData(this.definitions, stringRefs)
            };
            return castedToInterface;
        }
        //return p.measure(bodyCode);
    }
    copy() {
        //let bodyCode = () =>
        {
            let c = new Document(this.name, (this.imports && this.imports.length > 0));
            c.path = this.path;
            c.schema = this.schema;
            c.schemaVersion = this.schemaVersion;
            c.definitions = cdmObject.arrayCopy(this.definitions);
            c.imports = cdmObject.arrayCopy(this.imports);
            return c;
        }
        //return p.measure(bodyCode);
    }
    validate() {
        //let bodyCode = () =>
        {
            return this.name ? true : false;
        }
        //return p.measure(bodyCode);
    }
    getFriendlyFormat() {
        //let bodyCode = () =>
        {
            let ff = new friendlyFormatNode();
            ff.verticalMode = true;
            ff.indentChildren = false;
            ff.separator = "\n";
            let ffImp = new friendlyFormatNode();
            ffImp.indentChildren = false;
            ffImp.separator = ";";
            ffImp.terminator = ";";
            ffImp.verticalMode = true;
            cdmObject.arrayGetFriendlyFormat(ffImp, this.imports);
            ff.addChild(ffImp);
            let ffDef = new friendlyFormatNode();
            ffDef.indentChildren = false;
            ffDef.separator = ";\n";
            ffDef.terminator = ";";
            ffDef.verticalMode = true;
            cdmObject.arrayGetFriendlyFormat(ffDef, this.definitions);
            ff.addChild(ffDef);
            return ff;
        }
        //return p.measure(bodyCode);
    }
    constructResolvedAttributes() {
        //let bodyCode = () =>
        {
            return null;
        }
        //return p.measure(bodyCode);
    }
    constructResolvedTraits(rtsb) {
        //let bodyCode = () =>
        {
            return null;
        }
        //return p.measure(bodyCode);
    }
    static createClass(name, path, object) {
        //let bodyCode = () =>
        {
            let doc = new Document(name, object.imports);
            doc.path = path;
            if (object.$schema)
                doc.schema = object.$schema;
            if (object.jsonSchemaSemanticVersion)
                doc.schemaVersion = object.jsonSchemaSemanticVersion;
            if (object.imports) {
                let l = object.imports.length;
                for (let i = 0; i < l; i++) {
                    doc.imports.push(ImportImpl.createClass(object.imports[i]));
                }
            }
            if (object.definitions) {
                let l = object.definitions.length;
                for (let i = 0; i < l; i++) {
                    const d = object.definitions[i];
                    if (d.dataTypeName)
                        doc.definitions.push(DataTypeImpl.createClass(d));
                    else if (d.relationshipName)
                        doc.definitions.push(RelationshipImpl.createClass(d));
                    else if (d.attributeGroupName)
                        doc.definitions.push(AttributeGroupImpl.createClass(d));
                    else if (d.traitName)
                        doc.definitions.push(TraitImpl.createClass(d));
                    else if (d.entityShape)
                        doc.definitions.push(ConstantEntityImpl.createClass(d));
                    else if (d.entityName)
                        doc.definitions.push(EntityImpl.createClass(d));
                }
            }
            return doc;
        }
        //return p.measure(bodyCode);
    }
    addImport(uri, moniker) {
        //let bodyCode = () =>
        {
            if (!this.imports)
                this.imports = new Array();
            this.imports.push(new ImportImpl(uri, moniker));
        }
        //return p.measure(bodyCode);
    }
    getImports() {
        //let bodyCode = () =>
        {
            return this.imports;
        }
        //return p.measure(bodyCode);
    }
    addDefinition(ofType, name) {
        //let bodyCode = () =>
        {
            let newObj = Corpus.MakeObject(ofType, name);
            if (newObj != null)
                this.definitions.push(newObj);
            return newObj;
        }
        //return p.measure(bodyCode);
    }
    getSchema() {
        //let bodyCode = () =>
        {
            return this.schema;
        }
        //return p.measure(bodyCode);
    }
    getName() {
        //let bodyCode = () =>
        {
            return this.name;
        }
        //return p.measure(bodyCode);
    }
    getSchemaVersion() {
        //let bodyCode = () =>
        {
            return this.schemaVersion;
        }
        //return p.measure(bodyCode);
    }
    getDefinitions() {
        //let bodyCode = () =>
        {
            return this.definitions;
        }
        //return p.measure(bodyCode);
    }
    visit(userData, pathRoot, preChildren, postChildren, statusRpt) {
        //let bodyCode = () =>
        {
            if (preChildren && preChildren(userData, this, pathRoot, statusRpt))
                return false;
            if (this.definitions)
                if (cdmObject.visitArray(this.definitions, userData, pathRoot, preChildren, postChildren, statusRpt))
                    return true;
            if (postChildren && postChildren(userData, this, pathRoot, statusRpt))
                return true;
            return false;
        }
        //return p.measure(bodyCode);
    }
    indexImports(directory) {
        //let bodyCode = () =>
        {
            // put the imports that have documents assigned into either the flat list or the named lookup
            if (this.imports) {
                this.flatImports = new Array();
                this.monikeredImports = new Map();
                // where are we?
                let folder = directory.get(this);
                let l = this.imports.length;
                for (let i = 0; i < l; i++) {
                    const imp = this.imports[i];
                    if (imp.doc) {
                        // swap with local? if previoulsy made a local copy, use that
                        let docLocal = imp.doc;
                        if (folder && folder.localizedImports.has(docLocal))
                            docLocal = folder.localizedImports.get(docLocal);
                        if (imp.moniker && imp.moniker.length > 0) {
                            if (!this.monikeredImports.has(imp.moniker))
                                this.monikeredImports.set(imp.moniker, docLocal);
                        }
                        else {
                            this.flatImports.push(docLocal);
                        }
                    }
                }
            }
        }
        //return p.measure(bodyCode);
    }
    getObjectFromDocumentPath(objectPath) {
        //let bodyCode = () =>
        {
            // in current document?
            if (this.declarations.has(objectPath))
                return this.declarations.get(objectPath);
            return null;
        }
        //return p.measure(bodyCode);
    }
    resolveString(str, avoid, reportPath, status) {
        //let bodyCode = () =>
        {
            // all of the work of resolving references happens here at the leaf strings
            // if tracking the path for loops, then add us here unless there is already trouble?
            let docPath = this.path + this.name;
            // never come back into this document
            if (avoid.has(docPath))
                return null;
            avoid.add(docPath);
            let documentSeeker = (doc) => {
                // see if there is a prefix that might match one of the imports
                let preEnd = str.constantValue.indexOf('/');
                if (preEnd == 0) {
                    // absolute refererence
                    status(cdmStatusLevel.error, "no support for absolute references yet. fix '" + str.constantValue + "'", reportPath);
                    return null;
                }
                else if (preEnd > 0) {
                    let prefix = str.constantValue.slice(0, preEnd);
                    if (doc.monikeredImports && doc.monikeredImports.has(prefix)) {
                        let newRef = new StringConstant(str.expectedType, str.constantValue.slice(preEnd + 1));
                        return doc.monikeredImports.get(prefix).resolveString(newRef, avoid, reportPath, status);
                    }
                }
                // in current document?
                if (doc.declarations.has(str.constantValue))
                    return doc.declarations.get(str.constantValue);
                // let wild = str.constantValue.indexOf('*');
                // if (wild >= 0) {
                //     let srch = str.constantValue.replace(/\//g, "\\/").replace(/\*/g, "[\\S]*");
                //     let exp = new RegExp(srch, "g");
                //     let itr = doc.declarations.keys();
                //     let cur : IteratorResult<string> = itr.next();
                //     while(!cur.done) {
                //         if (cur.value.search(exp) == 0)
                //             return doc.declarations.get(cur.value);
                //         cur = itr.next();
                //     }
                // }
                // too dangerous. can match wrong things
                // look through the flat list of imports
                if (doc.flatImports) {
                    let seek;
                    // do this from bottom up so that the last imported declaration for a duplicate name is found first
                    let imps = doc.flatImports.length;
                    for (let imp = imps - 1; imp >= 0; imp--) {
                        let impDoc = doc.flatImports[imp];
                        seek = impDoc.resolveString(str, avoid, reportPath, status);
                        if (seek) {
                            // add this to the current document's declarations as a cache
                            doc.declarations.set(str.constantValue, seek);
                            return seek;
                        }
                    }
                }
                return null;
            };
            let found = documentSeeker(this);
            // found something, is it the right type?
            if (found) {
                switch (str.expectedType) {
                    case cdmObjectType.cdmObject:
                        break;
                    case cdmObjectType.attributeGroupRef:
                        if (!(found instanceof AttributeGroupImpl)) {
                            status(cdmStatusLevel.error, "expected type attributeGroup", reportPath);
                            found = null;
                        }
                        break;
                    case cdmObjectType.dataTypeRef:
                        if (!(found instanceof DataTypeImpl)) {
                            status(cdmStatusLevel.error, "expected type dataType", reportPath);
                            found = null;
                        }
                        break;
                    case cdmObjectType.entityRef:
                        if (!(found instanceof EntityImpl)) {
                            status(cdmStatusLevel.error, "expected type entity", reportPath);
                            found = null;
                        }
                        break;
                    case cdmObjectType.parameterDef:
                        if (!(found instanceof ParameterImpl)) {
                            status(cdmStatusLevel.error, "expected type parameter", reportPath);
                            found = null;
                        }
                        break;
                    case cdmObjectType.relationshipRef:
                        if (!(found instanceof RelationshipImpl)) {
                            status(cdmStatusLevel.error, "expected type relationship", reportPath);
                            found = null;
                        }
                        break;
                    case cdmObjectType.traitRef:
                        if (!(found instanceof TraitImpl)) {
                            status(cdmStatusLevel.error, "expected type trait", reportPath);
                            found = null;
                        }
                        break;
                }
            }
            return found;
        }
        //return p.measure(bodyCode);
    }
}
exports.Document = Document;
////////////////////////////////////////////////////////////////////////////////////////////////////
//  {folderDef}
////////////////////////////////////////////////////////////////////////////////////////////////////
class Folder {
    constructor(corpus, name, parentPath) {
        //let bodyCode = () =>
        {
            this.corpus = corpus;
            this.name = name;
            this.relativePath = parentPath + name + "/";
            this.subFolders = new Array();
            this.documents = new Array();
            this.localizedImports = new Map();
            this.documentLookup = new Map();
            this.objectType = cdmObjectType.folderDef;
        }
        //return p.measure(bodyCode);
    }
    getName() {
        //let bodyCode = () =>
        {
            return this.name;
        }
        //return p.measure(bodyCode);
    }
    validate() {
        //let bodyCode = () =>
        {
            return this.name ? true : false;
        }
        //return p.measure(bodyCode);
    }
    getRelativePath() {
        //let bodyCode = () =>
        {
            return this.relativePath;
        }
        //return p.measure(bodyCode);
    }
    getSubFolders() {
        //let bodyCode = () =>
        {
            return this.subFolders;
        }
        //return p.measure(bodyCode);
    }
    getDocuments() {
        //let bodyCode = () =>
        {
            return this.documents;
        }
        //return p.measure(bodyCode);
    }
    addFolder(name) {
        //let bodyCode = () =>
        {
            let newFolder = new Folder(this.corpus, name, this.relativePath);
            this.subFolders.push(newFolder);
            return newFolder;
        }
        //return p.measure(bodyCode);
    }
    addDocument(name, content) {
        //let bodyCode = () =>
        {
            let doc;
            if (this.documentLookup.has(name))
                return;
            if (content == null || content == "")
                doc = Document.createClass(name, this.relativePath, new Document(name, false));
            else if (typeof (content) === "string")
                doc = Document.createClass(name, this.relativePath, JSON.parse(content));
            else
                doc = Document.createClass(name, this.relativePath, content);
            this.documents.push(doc);
            this.corpus.addDocumentObjects(this, doc);
            this.documentLookup.set(name, doc);
            return doc;
        }
        //return p.measure(bodyCode);
    }
    getSubFolderFromPath(path, makeFolder = true) {
        //let bodyCode = () =>
        {
            let name;
            let remainingPath;
            let first = path.indexOf('/', 0);
            if (first < 0) {
                name = path.slice(0);
                remainingPath = "";
            }
            else {
                name = path.slice(0, first);
                remainingPath = path.slice(first + 1);
            }
            if (name.toUpperCase() == this.name.toUpperCase()) {
                // the end?
                if (remainingPath.length <= 2)
                    return this;
                // check children folders
                let result;
                if (this.subFolders) {
                    this.subFolders.some(f => {
                        result = f.getSubFolderFromPath(remainingPath, makeFolder);
                        if (result)
                            return true;
                    });
                }
                if (result)
                    return result;
                if (makeFolder) {
                    // huh, well need to make the fold here
                    first = remainingPath.indexOf('/', 0);
                    name = remainingPath.slice(0, first);
                    return this.addFolder(name).getSubFolderFromPath(remainingPath, makeFolder);
                }
                else {
                    // good enough, return where we got to
                    return this;
                }
            }
            return null;
        }
        //return p.measure(bodyCode);
    }
    getObjectFromFolderPath(objectPath) {
        //let bodyCode = () =>
        {
            let docName;
            let remainingPath;
            let first = objectPath.indexOf('/', 0);
            if (first < 0) {
                remainingPath = "";
                docName = objectPath;
            }
            else {
                remainingPath = objectPath.slice(first + 1);
                docName = objectPath.substring(0, first);
            }
            // got that doc?
            if (this.documentLookup.has(docName)) {
                let doc = this.documentLookup.get(docName);
                // all that is needed ?
                if (remainingPath.length < 2)
                    return doc;
                // doc will resolve it
                return doc.getObjectFromDocumentPath(remainingPath);
            }
            return null;
        }
        //return p.measure(bodyCode);
    }
    localizeImports(allDocuments, directory, status) {
        //let bodyCode = () =>
        {
            let errors = 0;
            let lDocs = this.documents.length;
            for (let iDoc = 0; iDoc < lDocs; iDoc++) {
                const doc = this.documents[iDoc];
                // find imports
                let imports = doc.getImports();
                if (imports && imports.length) {
                    for (let iImport = 0; iImport < imports.length; iImport++) {
                        const imp = imports[iImport];
                        if (imp.doc) {
                            let origFolder = directory.get(imp.doc);
                            // if from a different folder, make a copy here. once
                            if (origFolder && origFolder != this) {
                                if (!this.localizedImports.has(imp.doc)) {
                                    let local = imp.doc.copy();
                                    local.path = this.relativePath;
                                    local.name = "localized.import.of." + local.name;
                                    this.localizedImports.set(imp.doc, local);
                                    allDocuments.push([this, local]);
                                }
                            }
                        }
                    }
                }
            }
            if (this.subFolders) {
                let lSub = this.subFolders.length;
                for (let iSub = 0; iSub < lSub; iSub++) {
                    errors += this.subFolders[iSub].localizeImports(allDocuments, directory, status);
                }
            }
            return errors;
        }
        //return p.measure(bodyCode);
    }
    getObjectType() {
        //let bodyCode = () =>
        {
            return cdmObjectType.folderDef;
        }
        //return p.measure(bodyCode);
    }
    getObjectRefType() {
        //let bodyCode = () =>
        {
            return cdmObjectType.unresolved;
        }
        //return p.measure(bodyCode);
    }
    // required by base but makes no sense... should refactor
    visit(userData, pathRoot, preChildren, postChildren, statusRpt) {
        //let bodyCode = () =>
        {
            return false;
        }
        //return p.measure(bodyCode);
    }
    getObjectDef() {
        //let bodyCode = () =>
        {
            return null;
        }
        //return p.measure(bodyCode);
    }
    copyData(stringRefs) {
        //let bodyCode = () =>
        {
            return null;
        }
        //return p.measure(bodyCode);
    }
    getResolvedTraits(set) {
        //let bodyCode = () =>
        {
            return null;
        }
        //return p.measure(bodyCode);
    }
    setTraitParameterValue(toTrait, paramName, value) {
        //let bodyCode = () =>
        {
        }
        //return p.measure(bodyCode);
    }
    getResolvedAttributes() {
        //let bodyCode = () =>
        {
            return null;
        }
        //return p.measure(bodyCode);
    }
    copy() {
        //let bodyCode = () =>
        {
            return null;
        }
        //return p.measure(bodyCode);
    }
    getFriendlyFormat() {
        //let bodyCode = () =>
        {
            return null;
        }
        //return p.measure(bodyCode);
    }
}
exports.Folder = Folder;
////////////////////////////////////////////////////////////////////////////////////////////////////
//  {Corpus}
////////////////////////////////////////////////////////////////////////////////////////////////////
class Corpus extends Folder {
    constructor(rootPath) {
        super(null, "", "");
        this.statusLevel = cdmStatusLevel.info;
        //let bodyCode = () =>
        {
            this.corpus = this; // well ... it is
            this.rootPath = rootPath;
            this.allDocuments = new Array();
            this.pathLookup = new Map();
            this.directory = new Map();
        }
        //return p.measure(bodyCode);
    }
    static MakeRef(ofType, refObj) {
        //let bodyCode = () =>
        {
            let oRef;
            if (refObj) {
                if (typeof (refObj) === "string")
                    oRef = new StringConstant(ofType, refObj);
                else {
                    if (refObj.objectType == ofType)
                        oRef = refObj;
                    else {
                        oRef = this.MakeObject(refObj.getObjectRefType(), undefined);
                        oRef.setObjectDef(refObj);
                    }
                }
            }
            return oRef;
        }
        //return p.measure(bodyCode);
    }
    static MakeObject(ofType, nameOrRef) {
        //let bodyCode = () =>
        {
            let newObj = null;
            switch (ofType) {
                case cdmObjectType.argumentDef:
                    newObj = new ArgumentImpl();
                    newObj.name = nameOrRef;
                    break;
                case cdmObjectType.attributeGroupDef:
                    newObj = new AttributeGroupImpl(nameOrRef);
                    break;
                case cdmObjectType.attributeGroupRef:
                    newObj = new AttributeGroupReferenceImpl(this.MakeRef(ofType, nameOrRef));
                    break;
                case cdmObjectType.constantEntityDef:
                    newObj = new ConstantEntityImpl();
                    newObj.constantEntityName = nameOrRef;
                    break;
                case cdmObjectType.dataTypeDef:
                    newObj = new DataTypeImpl(nameOrRef, null, false);
                    break;
                case cdmObjectType.dataTypeRef:
                    newObj = new DataTypeReferenceImpl(this.MakeRef(ofType, nameOrRef), false);
                    break;
                case cdmObjectType.documentDef:
                    newObj = new Document(name, false);
                    break;
                case cdmObjectType.entityAttributeDef:
                    newObj = new EntityAttributeImpl(false);
                    newObj.entity = this.MakeRef(cdmObjectType.entityRef, nameOrRef);
                    break;
                case cdmObjectType.entityDef:
                    newObj = new EntityImpl(nameOrRef, null, false, false);
                    break;
                case cdmObjectType.entityRef:
                    newObj = new EntityReferenceImpl(this.MakeRef(ofType, nameOrRef), false);
                    break;
                case cdmObjectType.import:
                    newObj = new ImportImpl(nameOrRef);
                    break;
                case cdmObjectType.parameterDef:
                    newObj = new ParameterImpl(nameOrRef);
                    break;
                case cdmObjectType.relationshipDef:
                    newObj = new RelationshipImpl(nameOrRef, null, false);
                    break;
                case cdmObjectType.relationshipRef:
                    newObj = new RelationshipReferenceImpl(this.MakeRef(ofType, nameOrRef), false);
                    break;
                case cdmObjectType.stringConstant:
                    newObj = new StringConstant(cdmObjectType.unresolved, nameOrRef);
                    break;
                case cdmObjectType.traitDef:
                    newObj = new TraitImpl(nameOrRef, null, false);
                    break;
                case cdmObjectType.traitRef:
                    newObj = new TraitReferenceImpl(this.MakeRef(ofType, nameOrRef), false);
                    break;
                case cdmObjectType.typeAttributeDef:
                    newObj = new TypeAttributeImpl(nameOrRef, false);
                    break;
            }
            return newObj;
        }
        //return p.measure(bodyCode);
    }
    addDocumentObjects(folder, docDef) {
        //let bodyCode = () =>
        {
            let doc = docDef;
            let path = doc.path + doc.name;
            if (!this.pathLookup.has(path)) {
                this.allDocuments.push([folder, doc]);
                this.pathLookup.set(path, [folder, doc]);
                this.directory.set(doc, folder);
            }
            return doc;
        }
        //return p.measure(bodyCode);
    }
    addDocumentFromContent(uri, content) {
        //let bodyCode = () =>
        {
            let last = uri.lastIndexOf('/');
            if (last < 0)
                throw new Error("bad path");
            let name = uri.slice(last + 1);
            let path = uri.slice(0, last + 1);
            let folder = this.getSubFolderFromPath(path, true);
            if (folder == null && path == "/")
                folder = this;
            return folder.addDocument(name, content);
        }
        //return p.measure(bodyCode);
    }
    listMissingImports() {
        //let bodyCode = () =>
        {
            let missingSet = new Set();
            let l = this.allDocuments.length;
            for (let i = 0; i < l; i++) {
                const fd = this.allDocuments[i];
                if (fd["1"].imports) {
                    fd["1"].imports.forEach(imp => {
                        if (!imp.doc) {
                            // no document set for this import, see if it is already loaded into the corpus
                            let path = imp.uri;
                            if (path.charAt(0) != '/')
                                path = fd["0"].getRelativePath() + imp.uri;
                            let lookup = this.pathLookup.get(path);
                            if (lookup)
                                imp.doc = lookup["1"];
                            else
                                missingSet.add(path);
                        }
                    });
                }
            }
            if (missingSet.size == 0)
                return undefined;
            return missingSet;
        }
        //return p.measure(bodyCode);
    }
    getObjectFromCorpusPath(objectPath) {
        //let bodyCode = () =>
        {
            if (objectPath && objectPath.indexOf('/') == 0) {
                let lastFolder = this.getSubFolderFromPath(objectPath, false); // don't create new folders, just go as far as possible
                if (lastFolder) {
                    // maybe the seach is for a folder?
                    let lastPath = lastFolder.getRelativePath();
                    if (lastPath === objectPath)
                        return lastFolder;
                    // remove path to folder and then look in the folder 
                    objectPath = objectPath.slice(lastPath.length);
                    return lastFolder.getObjectFromFolderPath(objectPath);
                }
            }
            return null;
        }
        //return p.measure(bodyCode);
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    //  resolve imports
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    resolveImports(importResolver, status) {
        //let bodyCode = () =>
        {
            return new Promise(resolve => {
                let missingSet = this.listMissingImports();
                let result = true;
                let turnMissingImportsIntoClientPromises = () => {
                    if (missingSet) {
                        // turn each missing into a promise for a missing from the caller
                        missingSet.forEach(missing => {
                            importResolver(missing).then((success) => {
                                if (result) {
                                    // a new document for the corpus
                                    this.addDocumentFromContent(success[0], success[1]);
                                    // remove this from set
                                    missingSet.delete(success[0]);
                                    if (this.statusLevel <= cdmStatusLevel.progress)
                                        status(cdmStatusLevel.progress, `resolved import '${success[0]}'`, "");
                                    // if this is the last import, check to see if more are needed now and recurse 
                                    if (missingSet.size == 0) {
                                        missingSet = this.listMissingImports();
                                        turnMissingImportsIntoClientPromises();
                                    }
                                }
                            }, (fail) => {
                                result = false;
                                // something went wrong with one of the imports, give up on all of it
                                status(cdmStatusLevel.error, `failed to import '${fail[0]}' for reason : ${fail[1]}`, this.getRelativePath());
                                resolve(result);
                            });
                        });
                    }
                    else {
                        // nothing was missing, so just move to next resolve step
                        resolve(result);
                    }
                };
                turnMissingImportsIntoClientPromises();
            });
        }
        //return p.measure(bodyCode);
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    //
    //  resolve references
    //
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    resolveReferencesAndValidate(stage, status, errorLevel = cdmStatusLevel.warning) {
        //let bodyCode = () =>
        {
            return new Promise(resolve => {
                let errors = 0;
                let contextStack = new Array();
                let contextCurrent = {};
                contextStack.push(contextCurrent);
                // helper
                let constTypeCheck = (ctx, paramDef, aValue, userData, path, statusRpt) => {
                    // if parameter type is entity, then the value should be an entity or ref to one
                    // same is true of 'dataType' dataType
                    if (paramDef.getDataTypeRef()) {
                        let dt = paramDef.getDataTypeRef().getObjectDef();
                        // compare with passed in value or default for parameter
                        let pValue = aValue;
                        if (!pValue)
                            pValue = paramDef.getDefaultValue();
                        if (pValue) {
                            if (dt.isDerivedFrom("cdmObject")) {
                                let expectedTypes = new Array();
                                let expected;
                                if (dt.isDerivedFrom("entity")) {
                                    expectedTypes.push(cdmObjectType.constantEntityDef);
                                    expectedTypes.push(cdmObjectType.entityRef);
                                    expectedTypes.push(cdmObjectType.entityDef);
                                    expected = "entity";
                                }
                                else if (dt.isDerivedFrom("attribute")) {
                                    expectedTypes.push(cdmObjectType.typeAttributeDef);
                                    expectedTypes.push(cdmObjectType.entityAttributeDef);
                                    expected = "attribute";
                                }
                                else if (dt.isDerivedFrom("dataType")) {
                                    expectedTypes.push(cdmObjectType.dataTypeRef);
                                    expectedTypes.push(cdmObjectType.dataTypeDef);
                                    expected = "dataType";
                                }
                                else if (dt.isDerivedFrom("relationship")) {
                                    expectedTypes.push(cdmObjectType.relationshipRef);
                                    expectedTypes.push(cdmObjectType.relationshipDef);
                                    expected = "relationship";
                                }
                                else if (dt.isDerivedFrom("trait")) {
                                    expectedTypes.push(cdmObjectType.traitRef);
                                    expectedTypes.push(cdmObjectType.traitDef);
                                    expected = "trait";
                                }
                                else if (dt.isDerivedFrom("attributeGroup")) {
                                    expectedTypes.push(cdmObjectType.attributeGroupRef);
                                    expectedTypes.push(cdmObjectType.attributeGroupDef);
                                    expected = "attributeGroup";
                                }
                                if (expectedTypes.length == 0)
                                    statusRpt(cdmStatusLevel.error, `parameter '${paramDef.getName()}' has an unexpected dataType.`, ctx.currentDoc.path + path);
                                // if a string constant, resolve to an object ref.
                                let foundType = pValue.objectType;
                                let foundDesc = path;
                                if (foundType == cdmObjectType.stringConstant) {
                                    let sc = pValue;
                                    foundDesc = sc.constantValue;
                                    if (foundDesc == "this.attribute" && expected == "attribute") {
                                        sc.resolvedReference = ctx.currentAtttribute;
                                        foundType = cdmObjectType.typeAttributeDef;
                                    }
                                    else if (foundDesc == "this.trait" && expected == "trait") {
                                        sc.resolvedReference = ctx.currentTrait;
                                        foundType = cdmObjectType.traitDef;
                                    }
                                    else if (foundDesc == "this.entity" && expected == "entity") {
                                        sc.resolvedReference = ctx.currentEntity;
                                        foundType = cdmObjectType.entityDef;
                                    }
                                    else {
                                        let resAttToken = "/(resolvedAttributes)/";
                                        let seekResAtt = sc.constantValue.indexOf(resAttToken);
                                        if (seekResAtt >= 0) {
                                            let entName = sc.constantValue.substring(0, seekResAtt);
                                            let attName = sc.constantValue.slice(seekResAtt + resAttToken.length);
                                            // get the entity
                                            let ent = userData.resolveString(new StringConstant(cdmObjectType.entityDef, entName), new Set(), path, status);
                                            if (!ent || ent.objectType != cdmObjectType.entityDef) {
                                                statusRpt(cdmStatusLevel.warning, `unable to resolve an entity named '${entName}' from the reference '${foundDesc}'`, ctx.currentDoc.path + path);
                                                return null;
                                            }
                                            // get an object there that will get resolved later
                                            sc.resolvedReference = ent.getAttributePromise(attName);
                                            foundType = cdmObjectType.typeAttributeDef;
                                        }
                                        else {
                                            sc.expectedType = cdmObjectType.cdmObject;
                                            sc.resolvedReference = userData.resolveString(sc, new Set(), path, status);
                                            if (sc.resolvedReference) {
                                                foundType = sc.expectedType = sc.resolvedReference.objectType;
                                            }
                                        }
                                    }
                                }
                                if (expectedTypes.indexOf(foundType) == -1)
                                    statusRpt(cdmStatusLevel.error, `parameter '${paramDef.getName()}' has the dataType of '${expected}' but the value '${foundDesc}' does't resolve to a known ${expected} referenece`, ctx.currentDoc.path + path);
                                else {
                                    if (this.statusLevel <= cdmStatusLevel.info)
                                        statusRpt(cdmStatusLevel.info, `    resolved '${foundDesc}'`, path);
                                }
                            }
                        }
                    }
                };
                ////////////////////////////////////////////////////////////////////////////////////////////////////
                //  folder imports
                ////////////////////////////////////////////////////////////////////////////////////////////////////
                if (stage == cdmValidationStep.start || stage == cdmValidationStep.imports) {
                    if (this.statusLevel <= cdmStatusLevel.progress)
                        status(cdmStatusLevel.progress, "importing documents...", null);
                    // recurse through folders because this is contextual
                    // for each document in a folder look at the imports. if there are imports to objects from different folders, then
                    // make a folder local copy of the document. this is done so that any references the imported document makes are
                    // resolved relative to the folder where it is imported, not where it is defined. this lets us re-use shared definitions 
                    // that make references to other objects which might have a different meaning in the current folder
                    // note that imports done in the copy imported are going to still point at original objects. 
                    //errors = this.localizeImports(this.allDocuments, this.directory, status);
                    // work in progress...
                    let l = this.allDocuments.length;
                    for (let i = 0; i < l; i++) {
                        const fd = this.allDocuments[i];
                        // cache import documents
                        fd["1"].indexImports(this.directory);
                    }
                    ;
                    if (errors > 0) {
                        resolve(cdmValidationStep.error);
                    }
                    else {
                        resolve(cdmValidationStep.integrity);
                    }
                    return;
                }
                else if (stage == cdmValidationStep.integrity) {
                    ////////////////////////////////////////////////////////////////////////////////////////////////////
                    //  integrity
                    ////////////////////////////////////////////////////////////////////////////////////////////////////
                    if (this.statusLevel <= cdmStatusLevel.progress)
                        status(cdmStatusLevel.progress, "basic object integrity...", null);
                    // for each document, see if any object doesn't have the basic required shape
                    let l = this.allDocuments.length;
                    for (let i = 0; i < l; i++) {
                        const fd = this.allDocuments[i];
                        let doc = fd["1"];
                        doc.declarations = new Map();
                        doc.visit(null, "", (userData, iObject, path, statusRpt) => {
                            if (iObject.validate() == false) {
                                statusRpt(cdmStatusLevel.error, `integrity check failed for : '${path}'`, doc.path + path);
                            }
                            else if (this.statusLevel <= cdmStatusLevel.info)
                                statusRpt(cdmStatusLevel.info, `checked '${path}'`, doc.path + path);
                            return false;
                        }, null, (level, msg, path) => { if (level >= errorLevel)
                            errors++; status(level, msg, path); });
                    }
                    if (errors > 0) {
                        resolve(cdmValidationStep.error);
                    }
                    else {
                        resolve(cdmValidationStep.declarations);
                    }
                    return;
                }
                else if (stage == cdmValidationStep.declarations) {
                    ////////////////////////////////////////////////////////////////////////////////////////////////////
                    //  declarations
                    ////////////////////////////////////////////////////////////////////////////////////////////////////
                    if (this.statusLevel <= cdmStatusLevel.progress)
                        status(cdmStatusLevel.progress, "making declarations...", null);
                    // for each document, make a directory of the objects that are declared within it with a path relative to the doc
                    // the rules are that any declared object with a name or an attribute with a name adds the name to a path
                    let l = this.allDocuments.length;
                    for (let i = 0; i < l; i++) {
                        const fd = this.allDocuments[i];
                        let doc = fd["1"];
                        doc.declarations = new Map();
                        doc.visit(null, "", (userData, iObject, path, statusRpt) => {
                            if (path.indexOf("(unspecified)") > 0)
                                return true;
                            switch (iObject.objectType) {
                                case cdmObjectType.parameterDef:
                                case cdmObjectType.traitDef:
                                case cdmObjectType.relationshipDef:
                                case cdmObjectType.dataTypeDef:
                                case cdmObjectType.typeAttributeDef:
                                case cdmObjectType.entityAttributeDef:
                                case cdmObjectType.attributeGroupDef:
                                case cdmObjectType.constantEntityDef:
                                case cdmObjectType.entityDef:
                                    if (doc.declarations.has(path)) {
                                        statusRpt(cdmStatusLevel.error, `duplicate declaration for item '${path}'`, doc.path + path);
                                        return false;
                                    }
                                    doc.declarations.set(path, iObject);
                                    iObject.corpusPath = doc.path + doc.name + '/' + path;
                                    if (this.statusLevel <= cdmStatusLevel.info)
                                        statusRpt(cdmStatusLevel.info, `declared '${path}'`, doc.path + path);
                                    break;
                            }
                            return false;
                        }, null, (level, msg, path) => { if (level >= errorLevel)
                            errors++; status(level, msg, path); });
                    }
                    if (errors > 0) {
                        resolve(cdmValidationStep.error);
                    }
                    else {
                        resolve(cdmValidationStep.references);
                    }
                    return;
                }
                else if (stage == cdmValidationStep.references) {
                    ////////////////////////////////////////////////////////////////////////////////////////////////////
                    //  references
                    ////////////////////////////////////////////////////////////////////////////////////////////////////
                    // for each document, find each explicit or implicit reference and search for the object named. 
                    // if the name starts with a moniker for one of the imports, then look through that import first else look through the main document first.
                    // if not found, look through any of the imported documents that have no moniker in listed order. depth first avoiding cycles
                    // if any imports have not been resolved to documents, skip them
                    if (this.statusLevel <= cdmStatusLevel.progress)
                        status(cdmStatusLevel.progress, "resolving references...", null);
                    let l = this.allDocuments.length;
                    for (let i = 0; i < l; i++) {
                        const fd = this.allDocuments[i];
                        let doc = fd["1"];
                        contextCurrent.currentDoc = doc;
                        doc.visit(doc, "", (userData, iObject, path, statusRpt) => {
                            let ot = iObject.objectType;
                            switch (ot) {
                                case cdmObjectType.entityDef:
                                    contextCurrent = { currentDoc: doc, currentEntity: iObject };
                                    contextStack.push(contextCurrent);
                                    break;
                                case cdmObjectType.typeAttributeDef:
                                case cdmObjectType.entityAttributeDef:
                                    contextCurrent = { currentDoc: doc, currentEntity: contextCurrent.currentEntity, currentAtttribute: iObject };
                                    contextStack.push(contextCurrent);
                                    break;
                                case cdmObjectType.stringConstant:
                                    let sc = iObject;
                                    if (sc.expectedType != cdmObjectType.unresolved && sc.expectedType != cdmObjectType.argumentDef) {
                                        let avoid = new Set();
                                        sc.resolvedReference = userData.resolveString(sc, avoid, path, status);
                                        if (!sc.resolvedReference) {
                                            // it is 'ok' to not find entity refs sometimes
                                            let level = (sc.expectedType == cdmObjectType.entityRef || sc.expectedType == cdmObjectType.entityDef ||
                                                sc.expectedType == cdmObjectType.constantEntityDef || sc.expectedType == cdmObjectType.constantEntityRef)
                                                ? cdmStatusLevel.warning : cdmStatusLevel.error;
                                            statusRpt(level, `unable to resolve the reference '${sc.constantValue}' to a known object`, doc.path + path);
                                        }
                                        else {
                                            if (this.statusLevel <= cdmStatusLevel.info)
                                                statusRpt(cdmStatusLevel.info, `    resolved '${sc.constantValue}'`, doc.path + path);
                                        }
                                    }
                                    break;
                            }
                            return false;
                        }, (userData, iObject, path, statusRpt) => {
                            let ot = iObject.objectType;
                            switch (ot) {
                                case cdmObjectType.entityDef:
                                case cdmObjectType.typeAttributeDef:
                                case cdmObjectType.entityAttributeDef:
                                    contextStack.pop();
                                    contextCurrent = contextStack[contextStack.length - 1];
                                    break;
                                case cdmObjectType.parameterDef:
                                    // when a parameter has a datatype of 'entity' and a default value, then the default value should be a constant entity or ref to one
                                    let p = iObject;
                                    constTypeCheck(contextCurrent, p, null, userData, path, statusRpt);
                                    break;
                            }
                            return false;
                        }, (level, msg, path) => { if (level >= errorLevel)
                            errors++; status(level, msg, path); });
                    }
                    ;
                    if (errors > 0)
                        resolve(cdmValidationStep.error);
                    else
                        resolve(cdmValidationStep.parameters);
                    return;
                }
                else if (stage == cdmValidationStep.parameters) {
                    ////////////////////////////////////////////////////////////////////////////////////////////////////
                    //  parameters
                    ////////////////////////////////////////////////////////////////////////////////////////////////////
                    if (this.statusLevel <= cdmStatusLevel.progress)
                        status(cdmStatusLevel.progress, "binding parameters...", null);
                    // tie arguments to the parameter for the referenced trait
                    // if type is 'entity' and  value is a string, then resolve like a ref 
                    // calling getAllParameters will validate that there are no duplicate params in the inheritence chain of the trait
                    // calling resolveParameter will fail if there is no match on the given name or ordinal
                    let l = this.allDocuments.length;
                    for (let i = 0; i < l; i++) {
                        const fd = this.allDocuments[i];
                        let doc = fd["1"];
                        contextCurrent.currentDoc = doc;
                        doc.visit(doc, "", (userData, iObject, path, statusRpt) => {
                            let ot = iObject.objectType;
                            switch (ot) {
                                case cdmObjectType.entityDef:
                                    contextCurrent = { currentDoc: doc, currentEntity: iObject };
                                    contextStack.push(contextCurrent);
                                    break;
                                case cdmObjectType.typeAttributeDef:
                                case cdmObjectType.entityAttributeDef:
                                    contextCurrent = { currentDoc: doc, currentEntity: contextCurrent.currentEntity, currentAtttribute: iObject };
                                    contextStack.push(contextCurrent);
                                    break;
                                case cdmObjectType.traitRef:
                                    contextCurrent = { currentDoc: doc, currentEntity: contextCurrent.currentEntity, currentAtttribute: contextCurrent.currentAtttribute, currentTrait: iObject.getObjectDef(), currentParameter: 0 };
                                    contextStack.push(contextCurrent);
                                    break;
                                case cdmObjectType.stringConstant:
                                    if (iObject.expectedType != cdmObjectType.argumentDef)
                                        break;
                                case cdmObjectType.argumentDef:
                                    try {
                                        let params = contextCurrent.currentTrait.getAllParameters();
                                        let paramFound;
                                        let aValue;
                                        if (ot == cdmObjectType.argumentDef) {
                                            paramFound = params.resolveParameter(contextCurrent.currentParameter, iObject.getName());
                                            iObject.resolvedParameter = paramFound;
                                            aValue = iObject.value;
                                        }
                                        else {
                                            paramFound = params.resolveParameter(contextCurrent.currentParameter, null);
                                            iObject.resolvedParameter = paramFound;
                                            aValue = iObject;
                                        }
                                        // if parameter type is entity, then the value should be an entity or ref to one
                                        // same is true of 'dataType' dataType
                                        constTypeCheck(contextCurrent, paramFound, aValue, userData, path, statusRpt);
                                    }
                                    catch (e) {
                                        statusRpt(cdmStatusLevel.error, e.toString(), path);
                                        statusRpt(cdmStatusLevel.error, `failed to resolve parameter on trait '${contextCurrent.currentTrait.getName()}'`, doc.path + path);
                                    }
                                    contextCurrent.currentParameter++;
                                    break;
                            }
                            return false;
                        }, (userData, iObject, path, statusRpt) => {
                            let ot = iObject.objectType;
                            switch (ot) {
                                case cdmObjectType.entityDef:
                                case cdmObjectType.typeAttributeDef:
                                case cdmObjectType.entityAttributeDef:
                                case cdmObjectType.traitRef:
                                    contextStack.pop();
                                    contextCurrent = contextStack[contextStack.length - 1];
                                    break;
                            }
                            return false;
                        }, (level, msg, path) => { if (level >= errorLevel)
                            errors++; status(level, msg, path); });
                    }
                    ;
                    if (errors > 0)
                        resolve(cdmValidationStep.error);
                    else
                        resolve(cdmValidationStep.traits);
                    return;
                }
                else if (stage == cdmValidationStep.traits) {
                    if (this.statusLevel <= cdmStatusLevel.progress)
                        status(cdmStatusLevel.progress, "resolving traits...", null);
                    let assignAppliers = (traitMatch, traitAssign) => {
                        if (!traitMatch)
                            return;
                        if (traitMatch.getExtendsTrait())
                            assignAppliers(traitMatch.getExtendsTrait().getObjectDef(), traitAssign);
                        let traitName = traitMatch.getName();
                        // small number of matcher
                        PrimitiveAppliers.forEach(applier => {
                            if (applier.matchName == traitName)
                                traitAssign.addTraitApplier(applier);
                        });
                    };
                    let l = this.allDocuments.length;
                    for (let i = 0; i < l; i++) {
                        const fd = this.allDocuments[i];
                        let doc = fd["1"];
                        doc.visit(doc, "", (userData, iObject, path, statusRpt) => {
                            switch (iObject.objectType) {
                                case cdmObjectType.traitDef:
                                    // add trait appliers to this trait from base class on up
                                    assignAppliers(iObject, iObject);
                                    break;
                            }
                            return false;
                        }, null, (level, msg, path) => { if (level >= errorLevel)
                            errors++; status(level, msg, path); });
                    }
                    ;
                    // for every defined object, find and cache the full set of traits that are exhibited or applied during inheritence 
                    // and for each get a mapping of values (starting with default values) to parameters build from the base declaration up to the final
                    // so that any overrides done along the way take precidence.
                    // for trait definition, consider that when extending a base trait arguments can be applied.
                    for (let i = 0; i < l; i++) {
                        const fd = this.allDocuments[i];
                        let doc = fd["1"];
                        doc.visit(doc, "", (userData, iObject, path, statusRpt) => {
                            switch (iObject.objectType) {
                                case cdmObjectType.traitDef:
                                case cdmObjectType.relationshipDef:
                                case cdmObjectType.dataTypeDef:
                                case cdmObjectType.entityDef:
                                case cdmObjectType.attributeGroupDef:
                                    iObject.getResolvedTraits();
                                    break;
                                case cdmObjectType.entityAttributeDef:
                                case cdmObjectType.typeAttributeDef:
                                    iObject.getResolvedTraits();
                                    break;
                            }
                            return false;
                        }, null, (level, msg, path) => { if (level >= errorLevel)
                            errors++; status(level, msg, path); });
                    }
                    ;
                    if (this.statusLevel <= cdmStatusLevel.progress)
                        status(cdmStatusLevel.progress, "checking required arguments...", null);
                    let checkRequiredParamsOnResolvedTraits = (doc, obj, path, statusRpt) => {
                        let rts = obj.getResolvedTraits();
                        if (rts) {
                            let l = rts.size;
                            for (let i = 0; i < l; i++) {
                                const rt = rts.set[i];
                                let found = 0;
                                let resolved = 0;
                                if (rt.parameterValues) {
                                    let l = rt.parameterValues.length;
                                    for (let iParam = 0; iParam < l; iParam++) {
                                        if (rt.parameterValues.getParameter(iParam).getRequired()) {
                                            found++;
                                            if (!rt.parameterValues.getValue(iParam))
                                                statusRpt(cdmStatusLevel.error, `no argument supplied for required parameter '${rt.parameterValues.getParameter(iParam).getName()}' of trait '${rt.traitName}' on '${obj.getObjectDef().getName()}'`, doc.path + path);
                                            else
                                                resolved++;
                                        }
                                    }
                                }
                                if (found > 0 && found == resolved && this.statusLevel <= cdmStatusLevel.info)
                                    statusRpt(cdmStatusLevel.info, `found and resolved '${found}' required parameters of trait '${rt.traitName}' on '${obj.getObjectDef().getName()}'`, doc.path + path);
                            }
                        }
                    };
                    // now make sure that within the definition of an entity, every usage of a trait has values or default values for all required params
                    let inEntityDef = 0;
                    for (let i = 0; i < l; i++) {
                        const fd = this.allDocuments[i];
                        let doc = fd["1"];
                        doc.visit(doc, "", null, (userData, iObject, path, statusRpt) => {
                            let ot = iObject.objectType;
                            if (ot == cdmObjectType.entityDef) {
                                // get the resolution of all parameters and values through inheritence and defaults and arguments, etc.
                                checkRequiredParamsOnResolvedTraits(doc, iObject, path, statusRpt);
                                // do the same for all attributes
                                if (iObject.getHasAttributeDefs()) {
                                    iObject.getHasAttributeDefs().forEach((attDef) => {
                                        checkRequiredParamsOnResolvedTraits(doc, attDef, path, statusRpt);
                                    });
                                }
                            }
                            if (ot == cdmObjectType.attributeGroupDef) {
                                // get the resolution of all parameters and values through inheritence and defaults and arguments, etc.
                                checkRequiredParamsOnResolvedTraits(doc, iObject, path, statusRpt);
                                // do the same for all attributes
                                if (iObject.getMembersAttributeDefs()) {
                                    iObject.getMembersAttributeDefs().forEach((attDef) => {
                                        checkRequiredParamsOnResolvedTraits(doc, attDef, path, statusRpt);
                                    });
                                }
                            }
                            return false;
                        }, (level, msg, path) => { if (level >= errorLevel)
                            errors++; status(level, msg, path); });
                    }
                    ;
                    if (errors > 0)
                        resolve(cdmValidationStep.error);
                    else
                        resolve(cdmValidationStep.attributes);
                    return;
                }
                else if (stage == cdmValidationStep.attributes) {
                    ////////////////////////////////////////////////////////////////////////////////////////////////////
                    //  attributes
                    ////////////////////////////////////////////////////////////////////////////////////////////////////
                    if (this.statusLevel <= cdmStatusLevel.progress)
                        status(cdmStatusLevel.progress, "resolving attributes...", null);
                    // moving on ...
                    // for each entity, find and cache the complete set of attributes
                    // attributes definitions originate from and then get modified by subsequent re-defintions from (in this order):
                    // an extended entity, traits applied to extended entity, exhibited traits of main entity, the (datatype or entity) used as an attribute, traits applied to that datatype or entity,
                    // the relationsip of the attribute, the attribute definition itself and included attribute groups, any traits applied to the attribute.
                    // make sure there are no duplicates in the final step
                    let l = this.allDocuments.length;
                    for (let i = 0; i < l; i++) {
                        const fd = this.allDocuments[i];
                        let doc = fd["1"];
                        doc.visit(doc, "", (userData, iObject, path, statusRpt) => {
                            let ot = iObject.objectType;
                            if (ot == cdmObjectType.entityDef) {
                                iObject.getResolvedAttributes();
                            }
                            if (ot == cdmObjectType.attributeGroupDef) {
                                iObject.getResolvedAttributes();
                            }
                            return false;
                        }, null, (level, msg, path) => { if (level >= errorLevel)
                            errors++; status(level, msg, path); });
                    }
                    ;
                    // status(cdmStatusLevel.progress, `__paramCopy:${__paramCopy} __raCopy:${__raCopy} __rtsMergeOne:${__rtsMergeOne} __rasMergeOne:${__rasMergeOne} __rasApplyAdd:${__rasApplyAdd} __rasApplyRemove:${__rasApplyRemove}`, null);
                    // __paramCopy =  __raCopy = __rtsMergeOne = __rasMergeOne = __rasApplyAdd = __rasApplyRemove = 0;
                    if (errors > 0)
                        resolve(cdmValidationStep.error);
                    else
                        resolve(cdmValidationStep.entityReferences);
                    return;
                }
                else if (stage == cdmValidationStep.entityReferences) {
                    ////////////////////////////////////////////////////////////////////////////////////////////////////
                    //  entity references
                    ////////////////////////////////////////////////////////////////////////////////////////////////////
                    if (this.statusLevel <= cdmStatusLevel.progress)
                        status(cdmStatusLevel.progress, "resolving foreign key references...", null);
                    // for each entity, find and cache the complete set of references to other entities made through referencesA relationships
                    let l = this.allDocuments.length;
                    for (let i = 0; i < l; i++) {
                        const fd = this.allDocuments[i];
                        let doc = fd["1"];
                        doc.visit(doc, "", (userData, iObject, path, statusRpt) => {
                            let ot = iObject.objectType;
                            if (ot == cdmObjectType.entityDef) {
                                iObject.getResolvedEntityReferences();
                            }
                            return false;
                        }, null, (level, msg, path) => { if (level >= errorLevel)
                            errors++; status(level, msg, path); });
                    }
                    ;
                    if (errors > 0)
                        resolve(cdmValidationStep.error);
                    else
                        resolve(cdmValidationStep.cleanup);
                    return;
                }
                else if (stage == cdmValidationStep.cleanup) {
                    ////////////////////////////////////////////////////////////////////////////////////////////////////
                    //  cleanup references
                    ////////////////////////////////////////////////////////////////////////////////////////////////////
                    if (this.statusLevel <= cdmStatusLevel.progress)
                        status(cdmStatusLevel.progress, "finishing...", null);
                    // turn elevated traits back on, they are off by default and should work fully now that everything is resolved
                    let l = this.allDocuments.length;
                    for (let i = 0; i < l; i++) {
                        const fd = this.allDocuments[i];
                        let doc = fd["1"];
                        doc.visit(doc, "", (userData, iObject, path, statusRpt) => {
                            let obj = iObject;
                            obj.skipElevated = false;
                            obj.rtsbAll = null;
                            return false;
                        }, null, (level, msg, path) => { if (level >= errorLevel)
                            errors++; status(level, msg, path); });
                    }
                    ;
                    p.report();
                    if (visits) {
                        let max = 0;
                        let maxVisit = "";
                        visits.forEach((v, k) => {
                            if (v > 250) {
                                max = v;
                                maxVisit = k;
                            }
                        });
                        console.log(`${maxVisit}, ${max}`);
                    }
                    if (errors > 0)
                        resolve(cdmValidationStep.error);
                    else
                        resolve(cdmValidationStep.finished);
                    return;
                }
                resolve(cdmValidationStep.error);
            });
        }
        //return p.measure(bodyCode);
    }
}
exports.Corpus = Corpus;
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
//
//  appliers to support the traits from 'primitives.cmd'
//
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
let PrimitiveAppliers = [
    {
        matchName: "is.removed",
        priority: 10,
        attributeRemove: (resAtt, resTrait) => {
            return { "shouldDelete": true };
        }
    },
    {
        matchName: "does.addAttribute",
        priority: 9,
        willAdd: (resAtt, resTrait) => {
            return true;
        },
        attributeAdd: (resAtt, resTrait, continuationState) => {
            // get the added attribute and applied trait
            let sub = resTrait.parameterValues.getParameterValue("addedAttribute").value;
            sub = sub.copy();
            let appliedTrait = resTrait.parameterValues.getParameterValue("appliedTrait").value;
            if (appliedTrait) {
                sub.addAppliedTrait(appliedTrait); // could be a def or ref or string handed in. this handles it
            }
            return { "addedAttribute": sub };
        }
    },
    {
        matchName: "does.referenceEntity",
        priority: 8,
        attributeRemove: (resAtt, resTrait) => {
            let visible = true;
            if (resAtt) {
                // all others go away
                visible = false;
                if (resAtt.attribute === resTrait.parameterValues.getParameterValue("addedAttribute").value)
                    visible = true;
            }
            return { "shouldDelete": !visible };
        }
    },
    {
        matchName: "does.addSupportingAttribute",
        priority: 8,
        willAdd: (resAtt, resTrait) => {
            return true;
        },
        attributeAdd: (resAtt, resTrait, continuationState) => {
            // get the added attribute and applied trait
            let sub = resTrait.parameterValues.getParameterValue("addedAttribute").value;
            sub = sub.copy();
            let appliedTrait = resTrait.parameterValues.getParameterValue("appliedTrait").value;
            appliedTrait = appliedTrait.getObjectDef();
            // shove new trait onto attribute
            sub.addAppliedTrait(appliedTrait); // could be a def or ref or string handed in. this handles it
            let supporting = "(unspecified)";
            if (resAtt)
                supporting = resAtt.resolvedName;
            sub.setTraitParameterValue(appliedTrait, "inSupportOf", supporting);
            return { "addedAttribute": sub };
        }
    },
    {
        matchName: "is.array",
        priority: 6,
        willAdd: (resAtt, resTrait) => {
            return resAtt ? true : false;
        },
        attributeAdd: (resAtt, resTrait, continuationState) => {
            let newAtt;
            let newContinue;
            if (resAtt) {
                if (!continuationState) {
                    // get the fixed size (not set means no fixed size)
                    let fixedSizeString = resTrait.parameterValues.getParameterValue("fixedSize").valueString;
                    if (fixedSizeString && fixedSizeString != "undefined") {
                        let fixedSize = Number.parseInt(fixedSizeString);
                        let renameTrait = resTrait.parameterValues.getParameterValue("renameTrait").value;
                        if (renameTrait) {
                            let ordinal = Number.parseInt(renameTrait.getResolvedTraits().first.parameterValues.getParameterValue("ordinal").valueString);
                            continuationState = { curentOrdinal: ordinal, finalOrdinal: ordinal + fixedSize - 1, renameTrait: renameTrait };
                        }
                    }
                }
                if (continuationState) {
                    if (continuationState.curentOrdinal <= continuationState.finalOrdinal) {
                        newAtt = resAtt.attribute.copy();
                        // add the rename trait to the new attribute
                        let newRenameTraitRef = continuationState.renameTrait.copy();
                        newRenameTraitRef.setArgumentValue("ordinal", continuationState.curentOrdinal.toString());
                        newAtt.addAppliedTrait(newRenameTraitRef);
                        // and get rid of is.array trait
                        newAtt.removedTraitDef(resTrait.trait);
                        continuationState.curentOrdinal++;
                        if (continuationState.curentOrdinal > continuationState.finalOrdinal)
                            continuationState = null;
                    }
                }
            }
            return { "addedAttribute": newAtt, "continuationState": continuationState };
        },
        attributeRemove: (resAtt, resTrait) => {
            // array attributes get removed after being enumerated
            return { "shouldDelete": true };
        }
    },
    {
        matchName: "does.renameWithFormat",
        priority: 6,
        willApply: (resAtt, resTrait) => {
            return (resAtt ? true : false);
        },
        attributeApply: (resAtt, resTrait) => {
            if (resAtt) {
                let format = resTrait.parameterValues.getParameterValue("renameFormat").valueString;
                let ordinal = resTrait.parameterValues.getParameterValue("ordinal").valueString;
                if (!format)
                    return { "shouldDelete": false };
                let formatLength = format.length;
                if (formatLength == 0)
                    return { "shouldDelete": false };
                // parse the format looking for positions of {n} and {o} and text chunks around them
                // there are only 5 possibilies
                let iN = format.indexOf("{n}");
                let iO = format.indexOf("{o}");
                let replace = (start, at, length, value) => {
                    let replaced = "";
                    if (at > start)
                        replaced = format.slice(start, at);
                    replaced += value;
                    if (at + 3 < length)
                        replaced += format.slice(at + 3, length);
                    return replaced;
                };
                let result;
                if (iN < 0 && iO < 0) {
                    result = format;
                }
                else if (iN < 0) {
                    result = replace(0, iO, formatLength, ordinal);
                }
                else if (iO < 0) {
                    result = replace(0, iN, formatLength, resAtt.resolvedName);
                }
                else if (iN < iO) {
                    result = replace(0, iN, iO, resAtt.resolvedName);
                    result += replace(iO, iO, formatLength, ordinal);
                }
                else {
                    result = replace(0, iO, iN, ordinal);
                    result += replace(iN, iN, formatLength, resAtt.resolvedName);
                }
                resAtt.resolvedName = result;
            }
            return { "shouldDelete": false };
            ;
        }
    }
];

},{"perf_hooks":1}]},{},[2])(2)
});

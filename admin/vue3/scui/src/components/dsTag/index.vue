<!--
 * @Descripttion: 标签组件
-->

<template>
    <el-tag
        v-for="tag in defaultValue"
        :key="tag"
        closable
        :disable-transitions="false"
        @close="handleClose(tag)"
    >{{ tag }}</el-tag>
    <div>
        <el-input
            v-if="inputVisible"
            ref="saveTagInput"
            v-model="inputValue"
            class="input-new-tag"
            size="mini"
            @keyup.enter="handleInputConfirm"
            @blur="handleInputConfirm"
        ></el-input>
        <el-button
            v-else
            class="button-new-tag"
            icon="el-icon-plus"
            size="small"
            @click="showInput"
        ></el-button>
    </div>
</template>

<script>
export default {
    props: {
        modelValue: { type: Array, default: () => [] },
        loading: { type: Boolean, default: false }
    },
    data() {
        return {
            inputVisible: false,
            inputValue: '',
            defaultValue: []
        }
    },
    watch: {
        modelValue(val) {
            this.defaultValue = val
        },
        defaultValue(val){
            this.$emit('update:modelValue', val)
        }
    },
    mounted() {
        this.defaultValue = this.modelValue
    },
    methods: {
        handleClose(tag) {
            this.defaultValue.splice(this.defaultValue.indexOf(tag), 1);
            this.$emit('update:modelValue', this.defaultValue);
        },
        showInput() {
            this.inputVisible = true;
            this.$nextTick(() => {
                this.$refs.saveTagInput.$refs.input.focus();
            });
        },

        handleInputConfirm() {
            const inputValue = this.inputValue;
            if (inputValue) {
                this.defaultValue.push(inputValue);
                this.$emit('update:modelValue', this.defaultValue);
            }
            this.inputVisible = false;
            this.inputValue = "";
        },
    }
}
</script>

<style scoped>
.el-tag + .el-tag {
    margin-left: 10px;
}
.button-new-tag {
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
}
.input-new-tag {
    width: 90px;
    vertical-align: bottom;
}
</style>

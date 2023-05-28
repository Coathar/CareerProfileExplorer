<script lang="ts">
export default {
    methods: {
        fileChange(event: Event) {
            console.log(event?.target?.files);

            
    }
  }
}
</script>

<template>
    <div class="config-container title-font title-shadow">
        <h1>PROFILES</h1>
        <!-- TODO -->
    </div>

    <div class="config-container title-font title-shadow">
        <h1>IMPORT</h1>
        <label for="file-upload" class="upload-button">Upload File</label>
        <input type="file" id="file-upload" @change="fileChange"/>
    </div>
</template>

<style scoped>
.config-container {
    width: 50vw;
}

.upload-button {
    background-color: var(--color-button-secondary);
    padding: 5px;
    font-size: 1.5rem;
    cursor: pointer;
}

.help-text {
    font-size: 1.1rem;
    margin-top: 5px;
}

#file-upload {
    opacity: 0;
    position: absolute;
    z-index: -1;
}
</style>
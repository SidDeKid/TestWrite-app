<script lang="ts" setup>
import { companyInfoHelper } from "@/helpers/companyInfoHelper";
</script>


<template>
  <div class="notFound page">
    <div class="section">
      <h1>404 Pagina niet gevonden</h1>
    </div>
    <div class="section">
      <h2>Waar was je naar opzoek?</h2>
      <p>
        Mail het naar {{ companyInfoHelper.standardEmail }} a.u.b. Wij zouden het graag willen weten.
      </p>
    </div>
  </div>
</template>
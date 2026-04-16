<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />

    <div class="max-w-3xl mx-auto">
      <ComponentCard title="Tambah Batch">

        <div class="space-y-5">

          <!-- LOT CODE -->
          <div>
            <label class="block mb-1 text-sm">Lot Code</label>
            <input v-model="form.lot_code" class="input" />
          </div>

          <!-- FARMER -->
          <div>
            <label class="block mb-1 text-sm">Petani</label>
            <select v-model="form.farmer_id" class="input">
              <option value="">Pilih Petani</option>
              <option v-for="f in farmers" :key="f.id" :value="f.id">
                {{ f.name }}
              </option>
            </select>
          </div>

          <!-- LAND -->
          <div>
            <label class="block mb-1 text-sm">Lahan</label>
            <select v-model="form.land_id" class="input">
              <option value="">Pilih Lahan</option>
              <option v-for="l in lands" :key="l.id" :value="l.id">
                {{ l.location }}
              </option>
            </select>
          </div>

          <!-- FRUIT -->
          <div>
            <label class="block mb-1 text-sm">Jenis Buah</label>
            <input v-model="form.fruit_type" class="input" />
          </div>

          <!-- DATE -->
          <div>
            <label class="block mb-1 text-sm">Tanggal Panen</label>
            <input type="date" v-model="form.harvest_date" class="input" />
          </div>

          <!-- TIME -->
          <div>
            <label class="block mb-1 text-sm">Waktu Panen</label>
            <input type="time" v-model="form.harvest_time" class="input" />
          </div>

          <!-- TREATMENT -->
          <div>
            <label class="block mb-1 text-sm">Perlakuan</label>
            <textarea v-model="form.treatment" class="input"></textarea>
          </div>

          <!-- BUTTON -->
          <div class="pt-4">
            <button
              @click="handleSubmit"
              class="px-4 py-2 text-white bg-blue-600 rounded-lg"
            >
              Simpan Batch
            </button>
          </div>

        </div>

      </ComponentCard>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted } from "vue";
import AdminLayout from "@/components/layout/AdminLayout.vue";
import PageBreadcrumb from "@/components/common/PageBreadcrumb.vue";
import ComponentCard from "@/components/common/ComponentCard.vue";

import { createBatch } from "@/services/batchService";
import { getFarmers } from "@/services/farmerService";
import { getLands } from "@/services/landService";

const currentPageTitle = ref("Tambah Batch");

// FORM
const form = ref({
  lot_code: "",
  farmer_id: "",
  land_id: "",
  fruit_type: "Jambu Kristal",
  harvest_date: "",
  harvest_time: "",
  treatment: "",
});

// DATA
const farmers = ref([]);
const lands = ref([]);

// FETCH DATA
const fetchData = async () => {
  const f = await getFarmers();
  const l = await getLands();

  farmers.value = f.data;
  lands.value = l.data;
};

// SUBMIT
const handleSubmit = async () => {
  try {
    await createBatch(form.value);
    alert("Batch berhasil dibuat");

    window.location.href = "/batch";
  } catch (err) {
    console.error(err);
    alert("Gagal membuat batch");
  }
};

onMounted(fetchData);
</script>

<!-- <style scoped>
.input {
  @apply w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-900;
}
</style> -->
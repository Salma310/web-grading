<template>
  <div
    v-if="show"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    @click.self="$emit('close')"
  >
    <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-lg mx-4 p-6">
      <h2 class="text-lg font-semibold text-gray-800 dark:text-white mb-5">
        {{ isEdit ? "Edit Petani" : "Tambah Petani" }}
      </h2>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- Farmer Code -->
        <div v-if="!isEdit">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Kode Petani <span class="text-red-500">*</span>
          </label>
          <input
            v-model="form.farmer_code"
            type="text"
            required
            placeholder="e.g. F-001"
            class="w-full rounded-lg border border-gray-300 dark:border-gray-700 px-3 py-2 text-sm dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <!-- Name -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Nama <span class="text-red-500">*</span>
          </label>
          <input
            v-model="form.name"
            type="text"
            required
            placeholder="Nama petani"
            class="w-full rounded-lg border border-gray-300 dark:border-gray-700 px-3 py-2 text-sm dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <!-- Phone -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nomor HP</label>
          <input
            v-model="form.phone"
            type="text"
            placeholder="08xxxxxxxx"
            class="w-full rounded-lg border border-gray-300 dark:border-gray-700 px-3 py-2 text-sm dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <!-- Address -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Alamat</label>
          <textarea
            v-model="form.address"
            rows="2"
            placeholder="Alamat lengkap"
            class="w-full rounded-lg border border-gray-300 dark:border-gray-700 px-3 py-2 text-sm dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        <!-- Village & District -->
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Desa</label>
            <input
              v-model="form.village"
              type="text"
              placeholder="Nama desa"
              class="w-full rounded-lg border border-gray-300 dark:border-gray-700 px-3 py-2 text-sm dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Kecamatan</label>
            <input
              v-model="form.district"
              type="text"
              placeholder="Nama kecamatan"
              class="w-full rounded-lg border border-gray-300 dark:border-gray-700 px-3 py-2 text-sm dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <!-- City -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Kota/Kabupaten</label>
          <input
            v-model="form.city"
            type="text"
            placeholder="Nama kota"
            class="w-full rounded-lg border border-gray-300 dark:border-gray-700 px-3 py-2 text-sm dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <!-- Actions -->
        <div class="flex justify-end gap-3 pt-2">
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
          >
            Batal
          </button>
          <button
            type="submit"
            :disabled="loading"
            class="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition"
          >
            {{ loading ? "Menyimpan..." : "Simpan" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import type { Farmer, CreateFarmerPayload, UpdateFarmerPayload } from "@/types/farmertypes";
import { createFarmer, updateFarmer } from "@/services/farmerService";

interface Props {
  show: boolean;
  farmer?: Farmer | null;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  (e: "close"): void;
  (e: "saved"): void;
}>();

const isEdit = ref(false);
const loading = ref(false);

const form = ref<CreateFarmerPayload & { is_active?: boolean }>({
  farmer_code: "",
  name: "",
  phone: "",
  address: "",
  village: "",
  district: "",
  city: "",
});

watch(
  () => props.farmer,
  (val) => {
    if (val) {
      isEdit.value = true;
      form.value = {
        farmer_code: val.farmer_code,
        name: val.name,
        phone: val.phone ?? "",
        address: val.address ?? "",
        village: val.village ?? "",
        district: val.district ?? "",
        city: val.city ?? "",
      };
    } else {
      isEdit.value = false;
      form.value = { farmer_code: "", name: "", phone: "", address: "", village: "", district: "", city: "" };
    }
  },
  { immediate: true }
);

const handleSubmit = async () => {
  loading.value = true;
  try {
    if (isEdit.value && props.farmer) {
      const payload: UpdateFarmerPayload = {
        name: form.value.name,
        phone: form.value.phone,
        address: form.value.address,
        village: form.value.village,
        district: form.value.district,
        city: form.value.city,
      };
      await updateFarmer(props.farmer.id, payload);
    } else {
      await createFarmer(form.value);
    }
    emit("saved");
    emit("close");
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
};
</script>
<template>
  <div
    v-if="show"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    @click.self="$emit('close')"
  >
    <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-lg mx-4 p-6">
      <h2 class="text-lg font-semibold text-gray-800 dark:text-white mb-5">
        {{ isEdit ? "Edit Lahan" : "Tambah Lahan" }}
      </h2>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- Land Code -->
        <div v-if="!isEdit">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Kode Lahan <span class="text-red-500">*</span>
          </label>
          <input
            v-model="form.land_code"
            type="text"
            required
            placeholder="e.g. L-001"
            class="w-full rounded-lg border border-gray-300 dark:border-gray-700 px-3 py-2 text-sm dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <!-- Land Name -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nama Lahan</label>
          <input
            v-model="form.land_name"
            type="text"
            placeholder="Nama lahan"
            class="w-full rounded-lg border border-gray-300 dark:border-gray-700 px-3 py-2 text-sm dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <!-- Location -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Lokasi</label>
          <input
            v-model="form.location"
            type="text"
            placeholder="Deskripsi lokasi"
            class="w-full rounded-lg border border-gray-300 dark:border-gray-700 px-3 py-2 text-sm dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <!-- Lat & Lng -->
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Latitude</label>
            <input
              v-model.number="form.latitude"
              type="number"
              step="any"
              placeholder="-7.983908"
              class="w-full rounded-lg border border-gray-300 dark:border-gray-700 px-3 py-2 text-sm dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Longitude</label>
            <input
              v-model.number="form.longitude"
              type="number"
              step="any"
              placeholder="112.621391"
              class="w-full rounded-lg border border-gray-300 dark:border-gray-700 px-3 py-2 text-sm dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <!-- Area size & Fruit type -->
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Luas (Ha)</label>
            <input
              v-model.number="form.area_size"
              type="number"
              step="any"
              placeholder="0.5"
              class="w-full rounded-lg border border-gray-300 dark:border-gray-700 px-3 py-2 text-sm dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Jenis Buah</label>
            <input
              v-model="form.fruit_type"
              type="text"
              placeholder="Mangga, Apel, dll"
              class="w-full rounded-lg border border-gray-300 dark:border-gray-700 px-3 py-2 text-sm dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
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
import type { CreateLandPayload, UpdateLandPayload } from "@/types/landtypes";
import type { Land } from "@/types/farmertypes";
import { createLand, updateLand } from "@/services/landService";

interface Props {
  show: boolean;
  farmerId: string;
  land?: Land | null;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  (e: "close"): void;
  (e: "saved"): void;
}>();

const isEdit = ref(false);
const loading = ref(false);

const form = ref<CreateLandPayload>({
  farmer_id: "",
  land_code: "",
  land_name: "",
  location: "",
  latitude: undefined,
  longitude: undefined,
  area_size: undefined,
  fruit_type: "",
});

watch(
  () => props.land,
  (val) => {
    if (val) {
      isEdit.value = true;
      form.value = {
        farmer_id: props.farmerId,
        land_code: val.land_code,
        land_name: val.land_name ?? "",
        location: val.location ?? "",
        latitude: val.latitude,
        longitude: val.longitude,
        area_size: val.area_size,
        fruit_type: val.fruit_type ?? "",
      };
    } else {
      isEdit.value = false;
      form.value = {
        farmer_id: props.farmerId,
        land_code: "",
        land_name: "",
        location: "",
        latitude: undefined,
        longitude: undefined,
        area_size: undefined,
        fruit_type: "",
      };
    }
  },
  { immediate: true }
);

const handleSubmit = async () => {
  loading.value = true;
  try {
    if (isEdit.value && props.land) {
      const payload: UpdateLandPayload = {
        land_name: form.value.land_name,
        location: form.value.location,
        latitude: form.value.latitude,
        longitude: form.value.longitude,
        area_size: form.value.area_size,
        fruit_type: form.value.fruit_type,
      };
      await updateLand(props.land.id, payload);
    } else {
      form.value.farmer_id = props.farmerId;
      await createLand(form.value);
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
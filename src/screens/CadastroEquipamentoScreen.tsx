import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import type { Equipamento } from "../types/Equipamento";
import { criar } from "../services/equipamentoService";

type CadastroEquipamentoScreenProps = {
  onSalvo: () => void;
  onCancelar: () => void;
};

type StatusEquipamento = Equipamento["status"];

const statusOptions: StatusEquipamento[] = ["ATIVO", "MANUTENCAO", "INATIVO"];

function getDataAtualFormatada() {
  const hoje = new Date();
  const ano = hoje.getFullYear();
  const mes = String(hoje.getMonth() + 1).padStart(2, "0");
  const dia = String(hoje.getDate()).padStart(2, "0");

  return `${ano}-${mes}-${dia}`;
}

export function CadastroEquipamentoScreen({
  onSalvo,
  onCancelar,
}: CadastroEquipamentoScreenProps) {
  const [nome, setNome] = useState("");
  const [setor, setSetor] = useState("");
  const [status, setStatus] = useState<StatusEquipamento | "">("");
  const [temperaturaAtual, setTemperaturaAtual] = useState("");
  const [dataUltimaManutencao, setDataUltimaManutencao] = useState("");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [salvando, setSalvando] = useState(false);

  const salvar = async () => {
    if (!nome.trim() || !setor.trim()) {
      setErro("Preencha nome e setor antes de salvar.");
      setSucesso("");
      return;
    }

    const temperaturaNormalizada =
      temperaturaAtual.trim() === "" ? 0 : Number(temperaturaAtual);
    const equipamentoNormalizado: Omit<Equipamento, "id"> = {
      nome: nome.trim(),
      setor: setor.trim(),
      status: status || "ATIVO",
      temperaturaAtual: Number.isNaN(temperaturaNormalizada)
        ? 0
        : temperaturaNormalizada,
      dataUltimaManutencao:
        dataUltimaManutencao.trim() || getDataAtualFormatada(),
    };

    try {
      setSalvando(true);
      setErro("");
      setSucesso("");

      await criar(equipamentoNormalizado);

      setSucesso("Equipamento cadastrado com sucesso.");
      setTimeout(onSalvo, 700);
    } catch {
      setErro(
        "Nao foi possivel cadastrar o equipamento. Verifique se o backend esta rodando em http://localhost:8080."
      );
    } finally {
      setSalvando(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionLabel}>Novo registro local</Text>
        <Text style={styles.title}>Cadastro de equipamento</Text>
        <Text style={styles.subtitle}>
          Preencha os dados para gravar um equipamento no backend.
        </Text>

        <View style={styles.formCard}>
          <Text style={styles.inputLabel}>Nome</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex.: Furadeira CNC 04"
            placeholderTextColor="#98A2B3"
            value={nome}
            onChangeText={setNome}
            editable={!salvando}
          />

          <Text style={styles.inputLabel}>Setor</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex.: Linha de Producao B"
            placeholderTextColor="#98A2B3"
            value={setor}
            onChangeText={setSetor}
            editable={!salvando}
          />

          <Text style={styles.inputLabel}>Status</Text>
          <View style={styles.statusRow}>
            {statusOptions.map((option) => {
              const selecionado = status === option;

              return (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.statusButton,
                    selecionado && styles.statusButtonSelected,
                  ]}
                  onPress={() => setStatus(option)}
                  activeOpacity={0.85}
                  disabled={salvando}
                >
                  <Text
                    style={[
                      styles.statusButtonText,
                      selecionado && styles.statusButtonTextSelected,
                    ]}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={styles.inputLabel}>Temperatura atual</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex.: 65.2"
            placeholderTextColor="#98A2B3"
            value={temperaturaAtual}
            onChangeText={setTemperaturaAtual}
            keyboardType="numeric"
            editable={!salvando}
          />

          <Text style={styles.inputLabel}>Data da ultima manutencao</Text>
          <TextInput
            style={styles.input}
            placeholder="yyyy-MM-dd"
            placeholderTextColor="#98A2B3"
            value={dataUltimaManutencao}
            onChangeText={setDataUltimaManutencao}
            editable={!salvando}
          />

          {erro ? <Text style={styles.errorText}>{erro}</Text> : null}
          {sucesso ? <Text style={styles.successText}>{sucesso}</Text> : null}

          <TouchableOpacity
            style={[styles.primaryButton, salvando && styles.buttonDisabled]}
            onPress={salvar}
            activeOpacity={0.85}
            disabled={salvando}
          >
            <Text style={styles.primaryButtonText}>
              {salvando ? "Salvando..." : "Salvar equipamento"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.secondaryButton, salvando && styles.buttonDisabled]}
            onPress={onCancelar}
            activeOpacity={0.85}
            disabled={salvando}
          >
            <Text style={styles.secondaryButtonText}>Voltar para a lista</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#101828",
  },
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 36,
  },
  sectionLabel: {
    color: "#60A5FA",
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.8,
    marginBottom: 8,
    textTransform: "uppercase",
  },
  title: {
    color: "#F8FAFC",
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 8,
  },
  subtitle: {
    color: "#CBD5E1",
    fontSize: 15,
    lineHeight: 21,
    marginBottom: 20,
  },
  formCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: "#D0D5DD",
  },
  inputLabel: {
    color: "#344054",
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#D0D5DD",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: "#101828",
    backgroundColor: "#FFFFFF",
    marginBottom: 16,
  },
  statusRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 16,
  },
  statusButton: {
    borderWidth: 1,
    borderColor: "#BFDBFE",
    backgroundColor: "#EFF6FF",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  statusButtonSelected: {
    backgroundColor: "#2563EB",
    borderColor: "#2563EB",
  },
  statusButtonText: {
    color: "#1D4ED8",
    fontSize: 13,
    fontWeight: "700",
  },
  statusButtonTextSelected: {
    color: "#FFFFFF",
  },
  errorText: {
    color: "#B42318",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 14,
  },
  successText: {
    color: "#047857",
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 14,
  },
  primaryButton: {
    backgroundColor: "#2563EB",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 12,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  secondaryButton: {
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D0D5DD",
    backgroundColor: "#FFFFFF",
  },
  secondaryButtonText: {
    color: "#344054",
    fontSize: 15,
    fontWeight: "700",
  },
  buttonDisabled: {
    opacity: 0.65,
  },
});

import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { buscarPorId } from "../services/equipamentoService";
import type { Equipamento } from "../types/Equipamento";

type DetalheEquipamentoScreenProps = {
  equipamentoId: number;
  onVoltar: () => void;
};

const statusStyles = {
  ATIVO: {
    backgroundColor: "#DCFCE7",
    color: "#166534",
  },
  MANUTENCAO: {
    backgroundColor: "#FEF3C7",
    color: "#92400E",
  },
  INATIVO: {
    backgroundColor: "#FEE2E2",
    color: "#991B1B",
  },
} as const;

export function DetalheEquipamentoScreen({
  equipamentoId,
  onVoltar,
}: DetalheEquipamentoScreenProps) {
  const [equipamento, setEquipamento] = useState<Equipamento | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [carregadoComSucesso, setCarregadoComSucesso] = useState(false);
  const [tentativa, setTentativa] = useState(0);

  useEffect(() => {
    let ativo = true;

    async function carregarEquipamento() {
      try {
        setCarregando(true);
        setErro("");
        setCarregadoComSucesso(false);

        const dados = await buscarPorId(equipamentoId);

        if (ativo) {
          setEquipamento(dados);
          setCarregadoComSucesso(true);
        }
      } catch {
        if (ativo) {
          setErro(
            "Nao foi possivel consultar este equipamento. Verifique se o backend esta rodando e se o ID existe."
          );
        }
      } finally {
        if (ativo) {
          setCarregando(false);
        }
      }
    }

    carregarEquipamento();

    return () => {
      ativo = false;
    };
  }, [equipamentoId, tentativa]);

  const badgeStyle = equipamento ? statusStyles[equipamento.status] : null;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.sectionLabel}>Detalhes do equipamento</Text>
        <Text style={styles.title}>
          {equipamento ? equipamento.nome : "Carregando registro"}
        </Text>
        <Text style={styles.subtitle}>
          Consulte os dados reais do equipamento selecionado.
        </Text>

        {carregando ? (
          <View style={styles.card}>
            <ActivityIndicator color="#2563EB" />
            <Text style={styles.stateText}>Buscando equipamento...</Text>
          </View>
        ) : null}

        {!carregando && erro ? (
          <View style={[styles.card, styles.errorCard]}>
            <Text style={styles.errorTitle}>Consulta indisponivel</Text>
            <Text style={styles.errorText}>{erro}</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => setTentativa((valorAtual) => valorAtual + 1)}
              activeOpacity={0.85}
            >
              <Text style={styles.retryButtonText}>Tentar novamente</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {!carregando && !erro && equipamento && badgeStyle ? (
          <View style={styles.card}>
            <View
              style={[
                styles.badge,
                { backgroundColor: badgeStyle.backgroundColor },
              ]}
            >
              <Text style={[styles.badgeText, { color: badgeStyle.color }]}>
                {equipamento.status}
              </Text>
            </View>

            <View style={styles.infoGroup}>
              <Text style={styles.label}>Nome</Text>
              <Text style={styles.value}>{equipamento.nome}</Text>
            </View>

            <View style={styles.infoGroup}>
              <Text style={styles.label}>Setor</Text>
              <Text style={styles.value}>{equipamento.setor}</Text>
            </View>

            <View style={styles.infoGroup}>
              <Text style={styles.label}>Temperatura atual</Text>
              <Text style={styles.value}>
                {equipamento.temperaturaAtual.toFixed(1)} °C
              </Text>
            </View>

            <View style={styles.infoGroup}>
              <Text style={styles.label}>Data da ultima manutencao</Text>
              <Text style={styles.value}>{equipamento.dataUltimaManutencao}</Text>
            </View>

            {carregadoComSucesso ? (
              <Text style={styles.successText}>Registro carregado com sucesso.</Text>
            ) : null}
          </View>
        ) : null}

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={onVoltar}
          activeOpacity={0.85}
        >
          <Text style={styles.primaryButtonText}>Voltar para a lista</Text>
        </TouchableOpacity>
      </View>
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
    padding: 20,
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
  card: {
    backgroundColor: "#F8FAFC",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "#D0D5DD",
    marginBottom: 20,
  },
  stateText: {
    color: "#344054",
    fontSize: 15,
    fontWeight: "600",
    marginTop: 12,
    textAlign: "center",
  },
  errorCard: {
    borderColor: "#FDA29B",
  },
  errorTitle: {
    color: "#B42318",
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 8,
  },
  errorText: {
    color: "#7A271A",
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 14,
  },
  retryButton: {
    alignSelf: "flex-start",
    backgroundColor: "#2563EB",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 11,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  successText: {
    color: "#047857",
    fontSize: 13,
    fontWeight: "700",
  },
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    marginBottom: 18,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "700",
  },
  infoGroup: {
    marginBottom: 16,
  },
  label: {
    color: "#475467",
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  value: {
    color: "#101828",
    fontSize: 17,
  },
  primaryButton: {
    backgroundColor: "#2563EB",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});

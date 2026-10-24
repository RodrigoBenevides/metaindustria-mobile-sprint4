import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { EquipamentoCard } from "../components/EquipamentoCard";
import { listar } from "../services/equipamentoService";
import type { Equipamento } from "../types/Equipamento";

type ListaEquipamentosScreenProps = {
  atualizacao: number;
  onAbrirCadastro: () => void;
  onSelecionarEquipamento: (equipamentoId: number) => void;
};

export function ListaEquipamentosScreen({
  atualizacao,
  onAbrirCadastro,
  onSelecionarEquipamento,
}: ListaEquipamentosScreenProps) {
  const [equipamentos, setEquipamentos] = useState<Equipamento[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [carregadoComSucesso, setCarregadoComSucesso] = useState(false);
  const [tentativa, setTentativa] = useState(0);

  useEffect(() => {
    let ativo = true;

    async function carregarEquipamentos() {
      try {
        setCarregando(true);
        setErro("");
        setCarregadoComSucesso(false);

        const dados = await listar();

        if (ativo) {
          setEquipamentos(dados);
          setCarregadoComSucesso(true);
        }
      } catch {
        if (ativo) {
          setErro(
            "Nao foi possivel carregar os equipamentos. Verifique se o backend esta rodando em http://localhost:8080."
          );
        }
      } finally {
        if (ativo) {
          setCarregando(false);
        }
      }
    }

    carregarEquipamentos();

    return () => {
      ativo = false;
    };
  }, [atualizacao, tentativa]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.appLabel}>Metaindustria Mobile</Text>
        <Text style={styles.title}>Monitoramento de Equipamentos</Text>
        <Text style={styles.subtitle}>
          Dados reais carregados da API Spring Boot da Metaindustria.
        </Text>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={onAbrirCadastro}
          activeOpacity={0.85}
        >
          <Text style={styles.primaryButtonText}>Cadastrar equipamento</Text>
        </TouchableOpacity>

        {carregando ? (
          <View style={styles.stateCard}>
            <ActivityIndicator color="#2563EB" />
            <Text style={styles.stateText}>Carregando equipamentos...</Text>
          </View>
        ) : null}

        {!carregando && erro ? (
          <View style={[styles.stateCard, styles.errorCard]}>
            <Text style={styles.errorTitle}>Backend indisponivel</Text>
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

        {!carregando && !erro && carregadoComSucesso ? (
          <Text style={styles.successText}>Dados atualizados com sucesso.</Text>
        ) : null}

        {!carregando && !erro ? (
          <FlatList
            data={equipamentos}
            keyExtractor={(item) => String(item.id)}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <EquipamentoCard
                equipamento={item}
                onPress={() => onSelecionarEquipamento(item.id)}
              />
            )}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateTitle}>
                  Nenhum equipamento cadastrado.
                </Text>
                <Text style={styles.emptyStateText}>
                  Use o botao acima para adicionar um novo registro na API.
                </Text>
              </View>
            }
          />
        ) : null}
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
    paddingHorizontal: 20,
    paddingTop: 18,
  },
  appLabel: {
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
  primaryButton: {
    backgroundColor: "#2563EB",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 18,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  listContent: {
    paddingBottom: 24,
  },
  stateCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: "#D0D5DD",
    marginBottom: 16,
    alignItems: "center",
  },
  stateText: {
    color: "#344054",
    fontSize: 15,
    fontWeight: "600",
    marginTop: 12,
  },
  errorCard: {
    alignItems: "flex-start",
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
    color: "#BBF7D0",
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 12,
  },
  emptyState: {
    backgroundColor: "#F8FAFC",
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: "#D0D5DD",
  },
  emptyStateTitle: {
    color: "#0F172A",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
  },
  emptyStateText: {
    color: "#475467",
    fontSize: 14,
    lineHeight: 20,
  },
});

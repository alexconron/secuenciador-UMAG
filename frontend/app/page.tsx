"use client";

import { useState, useEffect } from "react";
import { createClient, Client } from "graphql-ws";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const baseIntensities: Record<string, number> = {
  G: 2.5,
  A: 1.5,
  T: 1,
  C: 2,
};

function generatePulseData(
  sequence: string
): { time: number; value: number }[] {
  const result: { time: number; value: number }[] = [];
  let time = 0;

  const regex = /m?C|[GAT]/g;
  const matches = sequence.match(regex) || [];

  matches.forEach((base) => {
    const intensity = baseIntensities[base] || 0;
    result.push({ time, value: intensity });
    time += 1;
  });

  return result;
}

export default function BasePulseSimulator() {
  const [sequence, setSequence] = useState("");
  const [pulseData, setPulseData] = useState<{ time: number; value: number }[]>(
    []
  );
  const [receivedSequence, setReceivedSequence] = useState<string>(""); // Nuevo estado para acumular nucleótidos

  useEffect(() => {
    const client: Client = createClient({
      url: "ws://localhost:8000/", 
    });

    const subscribe = async () => {
      const onNext = (data: any) => {
        if (data.data?.getNucleotide) {
          const nucleotide = data.data.getNucleotide;
          setReceivedSequence((prev) => prev + nucleotide); // Acumula los nucleótidos recibidos
          setPulseData((prev) => [
            ...prev,
            { time: prev.length, value: baseIntensities[nucleotide] || 0 },
          ]);
        }
      };

      const unsubscribe = client.subscribe(
        {
          query: `subscription ($amount: Int!) {
            getNucleotide(amount: $amount)
          }`,
          variables: { amount: 30 },
        },
        {
          next: onNext,
          error: (err) => console.error(err),
          complete: () => console.log("Subscription completed"),
        }
      );

      return () => unsubscribe();
    };

    const unsubscribe = subscribe();

    return () => {
      unsubscribe.then((fn) => fn());
    };
  }, []);

  const openBlastWeb = () => {
    const url = `https://blast.ncbi.nlm.nih.gov/Blast.cgi?PROGRAM=blastn&PAGE_TYPE=BlastSearch&QUERY=${encodeURIComponent(
      sequence
    )}`;
    window.open(url, "_blank");
  };

  return (
    <div className="flex items-center justify-center w-screen h-screen p-4">
      <Card className="w-full max-w-5xl shadow-md border border-slate-200 bg-white">
        <CardHeader>
          <CardTitle>Simulador de Pulsos de Bases</CardTitle>
          <CardDescription>
            Escribe una secuencia (ej: <code>GATC</code>) para generar los
            pulsos.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Ingresa la secuencia de bases..."
            value={sequence}
            onChange={(e) => {
              const input = e.target.value.toUpperCase();
              if (/^[AGCT]*$/.test(input)) {
                setSequence(input);
              }
            }}
            maxLength={100}
            minLength={10}
          />
          <div className="flex gap-2">
            <Button
              variant="default"
              onClick={openBlastWeb}
              disabled={sequence.length < 10}
            >
              Buscar en BLAST Web
            </Button>
          </div>
          {receivedSequence && (
            <div className="text-center text-lg font-semibold">
              Secuencia recibida: {receivedSequence}
            </div>
          )}
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={pulseData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Line
                type="stepAfter"
                dataKey="value"
                stroke="hsl(var(--chart-1))"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
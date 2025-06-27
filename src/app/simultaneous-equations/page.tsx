'use client';

import { useState, FormEvent } from 'react';
import styled from 'styled-components';
import Link from 'next/link';

const Root = styled.div`
  background: #1e1e2f;
  border-radius: 15px;
  padding: 40px 0;
  max-width: 900px;
  width: 90vw;
  box-shadow: 0 8px 16px rgba(0,0,0,0.4);
  margin: 40px auto;
  color: #eef1f7;
  font-family: 'Roboto Slab', serif;
  min-height: calc(100vh - 80px);
  display: flex;
  flex-direction: column;
`;

const Title = styled.h1`
  font-weight: 700;
  font-size: 1.5rem;
  margin-bottom: 16px;
  text-align: center;
`;

const Form = styled.form`
  background: #2c2c48;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 20px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1rem 2rem;
  flex: 1;

  @media (max-width: 480px) {
    grid-template-columns: 1fr 1fr;
    gap: 1rem 1rem;
  }
`;

const Label = styled.label`
  display: flex;
  flex-direction: column;
  font-weight: 600;
  font-size: 0.875rem;
  color: #eef1f7;
`;

const Input = styled.input`
  margin-top: 0.4rem;
  padding: 8px;
  font-size: 1rem;
  border: none;
  border-radius: 8px;
  background: #3a3a67;
  color: #eef1f7;
  transition: background-color 0.3s ease;

  &:focus {
    outline: none;
    background: #4a4a77;
  }
`;

const EquationLabel = styled.div`
  grid-column: span 3;
  font-size: 1.125rem;
  font-weight: 700;
  margin-top: 1rem;
  margin-bottom: 0.75rem;
  color: #eef1f7;
  user-select: none;

  @media (max-width: 480px) {
    grid-column: span 2;
  }
`;

const Button = styled.button`
  grid-column: span 3;
  background: #7d91f6;
  border: none;
  color: #1e1e2f;
  font-weight: 700;
  padding: 12px;
  font-size: 1.05rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;

  &:hover {
    background: #8d9ff6;
    transform: scale(1.02);
  }

  &:active {
    transform: scale(0.98);
  }

  @media (max-width: 480px) {
    grid-column: span 2;
  }
`;

const Result = styled.section`
  background: #2c2c48;
  padding: 1.5rem 2rem;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.07);
  font-size: 1.125rem;
  font-weight: 600;
  color: #eef1f7;
  min-height: 2.5em;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
`;

const HomeButton = styled(Link)`
  display: block;
  background: #7d91f6;
  color: #1e1e2f;
  text-decoration: none;
  font-weight: 700;
  padding: 12px;
  border-radius: 8px;
  text-align: center;
  transition: background-color 0.3s ease, transform 0.2s ease;

  &:hover {
    background: #8d9ff6;
    transform: scale(1.02);
  }

  &:active {
    transform: scale(0.98);
  }
`;

const ButtonContainer = styled.div`
  margin-top: auto;
`;

type Solution = {
  type: 'unique' | 'none' | 'infinite';
  x?: number;
  y?: number;
};

export default function SimultaneousEquations() {
  const [result, setResult] = useState<string>('ここに解が表示されます');

  const solveLinearEquations = (a1: number, b1: number, c1: number, a2: number, b2: number, c2: number): Solution => {
    const det = a1 * b2 - a2 * b1;
    if (det === 0) {
      const detX = c1 * b2 - c2 * b1;
      const detY = a1 * c2 - a2 * c1;
      if (detX === 0 && detY === 0) {
        return { type: 'infinite' };
      } else {
        return { type: 'none' };
      }
    }
    const x = (c1 * b2 - c2 * b1) / det;
    const y = (a1 * c2 - a2 * c1) / det;
    return { type: 'unique', x, y };
  };

  const formatNumber = (n: number): string => {
    if (Number.isInteger(n)) return n.toString();
    return n.toFixed(5);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const a1 = parseFloat((form.elements.namedItem('a1') as HTMLInputElement).value);
    const b1 = parseFloat((form.elements.namedItem('b1') as HTMLInputElement).value);
    const c1 = parseFloat((form.elements.namedItem('c1') as HTMLInputElement).value);
    const a2 = parseFloat((form.elements.namedItem('a2') as HTMLInputElement).value);
    const b2 = parseFloat((form.elements.namedItem('b2') as HTMLInputElement).value);
    const c2 = parseFloat((form.elements.namedItem('c2') as HTMLInputElement).value);

    if ([a1, b1, c1, a2, b2, c2].some(n => Number.isNaN(n))) {
      setResult('すべての係数に正しい数値を入力してください。');
      return;
    }

    const solution = solveLinearEquations(a1, b1, c1, a2, b2, c2);

    if (solution.type === 'none') {
      setResult('解なし（矛盾しています）。');
    } else if (solution.type === 'infinite') {
      setResult('解が無限に存在します。');
    } else {
      setResult(`解: x = ${formatNumber(solution.x!)} , y = ${formatNumber(solution.y!)}`);
    }
  };

  return (
    <Root>
      <Title>連立方程式計算ツール</Title>
      <Form onSubmit={handleSubmit} aria-label="連立方程式の係数入力フォーム">
        <EquationLabel>1つ目の式: a?x + b?y = c?</EquationLabel>
        <Label htmlFor="a1">
          a? (xの係数)
          <Input type="number" id="a1" name="a1" step="any" required aria-required="true" autoComplete="off" />
        </Label>
        <Label htmlFor="b1">
          b? (yの係数)
          <Input type="number" id="b1" name="b1" step="any" required aria-required="true" autoComplete="off" />
        </Label>
        <Label htmlFor="c1">
          c? (定数項)
          <Input type="number" id="c1" name="c1" step="any" required aria-required="true" autoComplete="off" />
        </Label>

        <EquationLabel>2つ目の式: a?x + b?y = c?</EquationLabel>
        <Label htmlFor="a2">
          a? (xの係数)
          <Input type="number" id="a2" name="a2" step="any" required aria-required="true" autoComplete="off" />
        </Label>
        <Label htmlFor="b2">
          b? (yの係数)
          <Input type="number" id="b2" name="b2" step="any" required aria-required="true" autoComplete="off" />
        </Label>
        <Label htmlFor="c2">
          c? (定数項)
          <Input type="number" id="c2" name="c2" step="any" required aria-required="true" autoComplete="off" />
        </Label>

        <Button type="submit" aria-label="連立方程式を解く">計算する</Button>
      </Form>

      <Result aria-live="polite" aria-atomic="true" role="region" aria-label="計算結果表示領域">
        {result}
      </Result>

      <ButtonContainer>
        <HomeButton href="/" aria-label="ホームに戻る">
          ホームに戻る
        </HomeButton>
      </ButtonContainer>
    </Root>
  );
}
---
description: Intelligent MBTI squad formation with dynamic team selection based on project analysis
argument-hint: [project description]
allowed-tools: *
---

# Dynamic MBTI Squad Formation System

$IF($ARGUMENTS == "" || $ARGUMENTS == "help")
## Intelligent Squad Formation

This command analyzes your project description and intelligently recommends the optimal combination of 3-5 MBTI types for your team.

**Usage:**
```
/squad [project description]
```

**Examples:**
- `/squad Build an e-commerce platform payment system`
- `/squad Build a real-time chat application with React and Node.js`
- `/squad Optimize existing database query performance to reduce response time`
- `/squad Design and implement a machine learning recommendation engine`

**Analysis Dimensions:**
1. **Legacy work pragmatism** - Maintenance and stability focus
2. **Innovation novelty** - Creative and cutting-edge requirements
3. **Innovation feasibility** - Practical implementation capability
4. **Timeline reasonableness** - Time pressure and deadline management
5. **Risk identification & mitigation** - Risk assessment and control
6. **Team collaboration efficiency** - Communication and coordination
7. **Technical complexity management** - Architecture and system design
8. **Stakeholder management** - External communication and alignment

Enter your project description to start intelligent team formation!
$ENDIF

$IF($ARGUMENTS != "" && $ARGUMENTS != "help")
# Intelligent Project Analysis

**Project Description:** $ARGUMENTS

## Multi-Dimensional Requirements Analysis

### 1. Legacy Work Pragmatism Analysis
**Keyword Identification:**
- Maintenance/Refactoring/Optimization → High pragmatism requirements
- New/Innovation/Exploration → Medium pragmatism requirements
- Experimental/Research/Proof of concept → Low pragmatism requirements

**Pragmatism Score:**
$IF($ARGUMENTS ~= "(maintain|refactor|optimize|fix|upgrade|migrate|legacy)")
**High (8-10/10)** - Requires stable and reliable executors
$ELIF($ARGUMENTS ~= "(new|develop|build|implement|integrate|create)")
**Medium (5-7/10)** - Balance innovation with stability
$ELSE
**Low (2-4/10)** - Can explore more innovation
$ENDIF

### 2. Innovation Novelty Requirements
**Technology Stack Analysis:**
$IF($ARGUMENTS ~= "(AI|machine learning|ML|deep learning|neural network|blockchain|Web3|VR|AR)")
**High Innovation (8-10/10)** - Requires cutting-edge technology explorers
$ELIF($ARGUMENTS ~= "(React|Vue|Angular|Node|Python|microservice|cloud native)")
**Medium Innovation (5-7/10)** - Modern technology stack application
$ELSE
**Standard Innovation (3-5/10)** - Mature technology implementation
$ENDIF

### 3. Feasibility Requirements
**Project Scale Assessment:**
$IF($ARGUMENTS ~= "(platform|system|architecture|enterprise|large-scale)")
**High Complexity** - Requires architects and project management
$ELIF($ARGUMENTS ~= "(module|feature|component|API|service)")
**Medium Complexity** - Requires balanced team configuration
$ELSE
**Low Complexity** - Streamlined team sufficient
$ENDIF

### 4. Timeline Pressure Analysis
**Urgency Level Identification:**
$IF($ARGUMENTS ~= "(urgent|fast|immediate|ASAP|MVP|prototype)")
**High Time Pressure** - Requires fast execution-oriented members
$ELIF($ARGUMENTS ~= "(plan|design|planning|long-term)")
**Low Time Pressure** - Can include deep thinking-oriented members
$ELSE
**Medium Time Pressure** - Balance execution with quality
$ENDIF

### 5. Risk Level Assessment
**Risk Factor Identification:**
$IF($ARGUMENTS ~= "(payment|financial|security|medical|production|critical business)")
**High Risk** - Must include risk control experts
$ELIF($ARGUMENTS ~= "(user data|API|integration|performance)")
**Medium Risk** - Requires quality assurance
$ELSE
**Low Risk** - Can explore more innovation
$ENDIF

## Intelligent Team Recommendation

---

**Team formation complete! Start your efficient collaborative development journey!**

*Use `/squad [new project description]` to form teams for other projects*
$ENDIF
